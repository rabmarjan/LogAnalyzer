import _ from 'lodash';

export function mapRequests(requests) {
  return _.reduce(_.values(requests), (result, value) => {
    _.each(value.statusCodes, (count, code) => {
      if (_.isUndefined(_.get(result, `status_codes.${code}`))) { _.set(result, `status_codes.${code}`, 0); }
      result.status_codes[code] += count;
    });
    result.total += value.total;
    result.disconnects += value.disconnects;
    return result;
  }, { total: 0, disconnects: 0, status_codes: {} });
}
