import { notFound } from 'boom';
import { set, findIndex } from 'lodash';
import { getClustersStats } from './get_clusters_stats';
import { flagSupportedClusters } from './flag_supported_clusters';
import { getMlJobsForCluster } from '../elasticsearch';
import { getKibanasForClusters } from '../kibana';
import { getLogstashForClusters } from '../logstash';
import { getBeatsForClusters } from '../beats';
import { calculateOverallStatus } from '../calculate_overall_status';
import { alertsClustersAggregation } from '../../cluster_alerts/alerts_clusters_aggregation';
import { alertsClusterSearch } from '../../cluster_alerts/alerts_cluster_search';
import { checkLicense as checkLicenseForAlerts } from '../../cluster_alerts/check_license';
import { CLUSTER_ALERTS_SEARCH_SIZE } from '../../../common/constants';

// manipulate cluster status and license meta data
export function normalizeClustersData(clusters) {
  clusters.forEach(cluster => {
    cluster.elasticsearch = {
      cluster_stats: cluster.cluster_stats,
      nodes: cluster.nodes,
      indices: cluster.indices
    };
    cluster.status = calculateOverallStatus([
      cluster.elasticsearch.status,
      cluster.kibana && cluster.kibana.status || null
    ]);
    delete cluster.cluster_stats;
    delete cluster.nodes;
    delete cluster.indices;
  });

  return clusters;
}

/**
 * Get all clusters or the cluster associated with {@code clusterUuid} when it is defined.
 */
export async function getClustersFromRequest(req, indexPatterns, { clusterUuid, start, end } = {}) {
  const { esIndexPattern, kbnIndexPattern, lsIndexPattern, beatsIndexPattern, alertsIndex } = indexPatterns;

  // get clusters with stats and cluster state
  let clusters = await getClustersStats(req, esIndexPattern, clusterUuid);

  // TODO: this handling logic should be two different functions
  if (clusterUuid) { // if not undefined, get specific cluster (no need for license checking)
    if (!clusters || clusters.length === 0) {
      throw notFound(`The cluster [${clusterUuid}] was not found within the selected time range.`);
    }

    const cluster = clusters[0];

    // add ml jobs and alerts data
    const mlJobs = await getMlJobsForCluster(req, esIndexPattern, cluster);
    if (mlJobs !== null) {
      cluster.ml = { jobs: mlJobs };
    }
    const alerts = await alertsClusterSearch(req, alertsIndex, cluster, checkLicenseForAlerts, {
      start,
      end,
      size: CLUSTER_ALERTS_SEARCH_SIZE
    });
    if (alerts) {
      cluster.alerts = alerts;
    }
  } else {
    // get all clusters
    if (!clusters || clusters.length === 0) {
      // we do NOT throw 404 here so that the no-data page can use this to check for data
      // we should look at having a standalone function for that lookup
      return [];
    }

    // update clusters with license check results
    const getSupportedClusters = flagSupportedClusters(req, kbnIndexPattern);
    clusters = await getSupportedClusters(clusters);

    // add alerts data
    const clustersAlerts = await alertsClustersAggregation(req, alertsIndex, clusters, checkLicenseForAlerts);
    clusters.forEach((cluster) => {
      cluster.alerts = {
        alertsMeta: {
          enabled: clustersAlerts.alertsMeta.enabled,
          message: clustersAlerts.alertsMeta.message // NOTE: this is only defined when the alert feature is disabled
        },
        ...clustersAlerts[cluster.cluster_uuid]
      };
    });
  }

  // add kibana data
  const kibanas = await getKibanasForClusters(req, kbnIndexPattern, clusters);
  // add the kibana data to each cluster
  kibanas.forEach(kibana => {
    const clusterIndex = findIndex(clusters, { cluster_uuid: kibana.clusterUuid });
    set(clusters[clusterIndex], 'kibana', kibana.stats);
  });

  // add logstash data
  const logstashes = await getLogstashForClusters(req, lsIndexPattern, clusters);
  // add the logstash data to each cluster
  logstashes.forEach(logstash => {
    const clusterIndex = findIndex(clusters, { cluster_uuid: logstash.clusterUuid });
    set(clusters[clusterIndex], 'logstash', logstash.stats);
  });

  // add beats data
  const beatsByCluster = await getBeatsForClusters(req, beatsIndexPattern, clusters);
  beatsByCluster.forEach(beats => {
    const clusterIndex = findIndex(clusters, { cluster_uuid: beats.clusterUuid });
    set(clusters[clusterIndex], 'beats', beats.stats);
  });

  return normalizeClustersData(clusters);
}
