import moment from 'moment';
import 'moment-duration-format';
import numeral from 'numeral';

export function formatBytesUsage(used, max) {
  return formatNumber(used, 'bytes') + ' / ' + formatNumber(max, 'bytes');
}

export function formatPercentageUsage(used, max) {
  return formatNumber(used / max, '0.00%');
}

export function formatNumber(num, which) {
  const isNan = Number.isNaN(num);
  let format = '0,0.0';
  if (typeof num !== 'number' || isNan) {
    if (num !== undefined && !isNan) {
      return num; // strings such as 'N/A' stay untouched
    }
    num = 0;
    format = '0'; // NaN/undefined becomes '0' not '0.0'
  }
  let postfix = '';
  switch (which) {
    case 'time_since':
      return moment(moment() - num).from(moment(), true);
    case 'time':
      return moment(num).format('H:mm:ss');
    case 'int_commas':
      format = '0,0';
      break;
    case 'byte':
      format += 'b';
      break;
    case 'ms':
      postfix = 'ms';
      break;
    default:
      if (which) { format = which; }
  }
  return numeral(num).format(format) + postfix;
}

export function formatMetric(value, format, suffix) {
  if (Boolean(value) || value === 0) {
    return formatNumber(value, format) + (suffix ? ' ' + suffix : '');
  }
  return 'N/A';
}
