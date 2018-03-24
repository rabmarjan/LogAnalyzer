import { get } from 'lodash';
import moment from 'moment';
import { checkParam } from '../error_missing_required';
import { createQuery } from '../create_query';
import { calculateAvailability } from '../calculate_availability';
import { ElasticsearchMetric } from '../metrics';

/*
 * Get detailed info for Logstash's in the cluster
 * for Logstash nodes listing page
 * For each instance:
 *  - name
 *  - status
 *  - JVM memory
 *  - os load average
 *  - events
 *  - config reloads
 */
export function getNodes(req, lsIndexPattern, { clusterUuid }) {
  checkParam(lsIndexPattern, 'lsIndexPattern in getNodes');

  const config = req.server.config();
  const start = moment.utc(req.payload.timeRange.min).valueOf();
  const end = moment.utc(req.payload.timeRange.max).valueOf();

  const params = {
    index: lsIndexPattern,
    ignoreUnavailable: true,
    body: {
      size: config.get('xpack.monitoring.max_bucket_size'), // FIXME
      query: createQuery({
        start,
        end,
        clusterUuid,
        metric: ElasticsearchMetric.getMetricFields(),
        type: 'logstash_stats'
      }),
      collapse: {
        field: 'logstash_stats.logstash.uuid'
      },
      sort: [
        { timestamp: { order: 'desc' } }
      ],
      _source: [
        'timestamp',
        'logstash_stats.process.cpu.percent',
        'logstash_stats.jvm.mem.heap_used_percent',
        'logstash_stats.os.cpu.load_average.1m',
        'logstash_stats.events.out',
        'logstash_stats.logstash.http_address',
        'logstash_stats.logstash.name',
        'logstash_stats.logstash.host',
        'logstash_stats.logstash.uuid',
        'logstash_stats.logstash.status',
        'logstash_stats.logstash.pipeline',
        'logstash_stats.reloads',
        'logstash_stats.logstash.version'
      ]
    }
  };

  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params)
    .then(resp => {
      const instances = get(resp, 'hits.hits', []);

      return instances.map(hit => {
        return {
          ...get(hit, '_source.logstash_stats'),
          availability: calculateAvailability(get(hit, '_source.timestamp'))
        };
      });
    });
}
