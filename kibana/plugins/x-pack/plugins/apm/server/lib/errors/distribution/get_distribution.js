import { getBuckets } from './get_buckets';

function getBucketSize({ start, end, config }) {
  const bucketTargetCount = config.get('xpack.apm.bucketTargetCount');
  return Math.floor((end - start) / bucketTargetCount);
}

export async function getDistribution({ serviceName, groupId, setup }) {
  const bucketSize = getBucketSize(setup);
  const { buckets, total_hits: totalHits } = await getBuckets({
    serviceName,
    groupId,
    bucketSize,
    setup
  });

  return {
    total_hits: totalHits,
    buckets,
    bucket_size: bucketSize
  };
}
