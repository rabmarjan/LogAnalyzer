import _ from 'lodash';

export function mapResponseTimes(times) {
  const responseTimes = _.reduce(_.values(times), (result, value) => {
    if (value.avg) {
      result.avg = Math.max(result.avg, value.avg);
    }
    result.max = Math.max(result.max, value.max);
    return result;
  }, { avg: 0, max: 0 });
  return {
    average: responseTimes.avg,
    max: responseTimes.max
  };
}
