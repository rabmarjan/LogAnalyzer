import moment from 'moment';
import { checkParam } from '../../error_missing_required';
import { createQuery } from '../../create_query.js';
import { calculateAuto } from '../../calculate_auto';
import { getAggItems } from '../../lists/get_agg_items';
import { mapResponse } from '../../lists/map_response';
import { ElasticsearchMetric } from '../../metrics';
import { getLatestAggKey, getNodeAttribute } from './node_agg_vals';

/* Run an aggregation on node_stats to get stat data for the selected time
 * range for all the active nodes. The stat data is built up with passed-in
 * options that are given by the UI client as an array
 * (req.payload.listingMetrics). Every option is a key to a configuration value
 * in server/lib/metrics. Those options are used to build up a query with a
 * bunch of date histograms.
 *
 * After the result comes back from Elasticsearch, we use it to generate:
 *
 * - "nodes" object - for every node, it has a Node Name, Node Transport
 *   Address, the Data and Master Attributes for each node, and build up an
 *   array of Node IDs for each node (there'll be multiple IDs if the node was
 *   restarted within the time range). The Node IDs are used only for
 *   determining if the node is a Master node.
 *
 * - "rows" object - all the date histogram data is passed to
 *   mapListingResponse to transform it into X/Y coordinates for charting. This
 *   method is shared by the get_listing_indices lib.
 *
 * All this data is used by the UI to render most of the table on the Nodes
 * page. we do need the X/Y coordinates to calculate the slope of the metric.
 * If we calculate the slope is going up, we just have an up arrow to say it's
 * going up, and likewise if the metric is going down, we have a down arrow
 */
export function getNodes(req, esIndexPattern) {
  checkParam(esIndexPattern, 'esIndexPattern in getNodes');

  const start = moment.utc(req.payload.timeRange.min).valueOf();
  const orgStart = start;
  const end = moment.utc(req.payload.timeRange.max).valueOf();
  const max = end;
  const duration = moment.duration(max - orgStart, 'ms');

  const config = req.server.config();
  const clusterUuid = req.params.clusterUuid;
  const maxBucketSize = config.get('xpack.monitoring.max_bucket_size');
  const metricFields = ElasticsearchMetric.getMetricFields();
  const min = start;

  const listingMetrics = req.payload.listingMetrics || [];
  const minIntervalSeconds = config.get('xpack.monitoring.min_interval_seconds');
  const bucketSize = Math.max(minIntervalSeconds, calculateAuto(100, duration).asSeconds());
  const aggItems = getAggItems({ listingMetrics, bucketSize, min, max });

  const params = {
    index: esIndexPattern,
    size: 0,
    ignoreUnavailable: true,
    body: {
      query: createQuery({ type: 'node_stats', start, end, clusterUuid, metric: metricFields }),
      aggs: {
        items: {
          terms: {
            field: `source_node.${config.get('xpack.monitoring.node_resolver')}`, // transport_address or node name
            size: maxBucketSize
          },
          aggs: {
            node_name: {
              terms: { field: 'source_node.name', size: maxBucketSize },
              aggs: { max_timestamp: { max: { field: 'timestamp' } } }
            },
            node_transport_address: {
              terms: { field: 'source_node.transport_address', size: maxBucketSize },
              aggs: { max_timestamp: { max: { field: 'timestamp' } } }
            },
            node_data_attributes: { terms: { field: 'source_node.attributes.data', size: maxBucketSize } },
            node_master_attributes: { terms: { field: 'source_node.attributes.master', size: maxBucketSize } },
            // for doing a join on the cluster state to determine if node is current master
            node_ids: { terms: { field: 'source_node.uuid', size: maxBucketSize } },
            ...aggItems
          }
        }
      }
    }
  };

  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params)
    .then((resp) => {
      if (!resp.hits.total) {
        return {
          nodes: {},
          rows: []
        };
      }

      const buckets = resp.aggregations.items.buckets;

      return {
      // for node names
        nodes: buckets.reduce(function (prev, curr) {
          prev[curr.key] = {
            name: getLatestAggKey(curr.node_name.buckets),
            transport_address: getLatestAggKey(curr.node_transport_address.buckets),
            node_ids: curr.node_ids.buckets.map(bucket => bucket.key), // needed in calculate_node_type to check if current master node
            attributes: {
              data: getNodeAttribute(curr.node_data_attributes.buckets),
              master: getNodeAttribute(curr.node_master_attributes.buckets)
            }
          };
          return prev;
        }, {}),
        // for listing metrics
        rows: mapResponse({
          type: 'nodes',
          items: buckets,
          listingMetrics,
          min,
          max,
          bucketSize
        })
      };
    });
}
