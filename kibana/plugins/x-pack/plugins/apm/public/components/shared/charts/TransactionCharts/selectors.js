import d3 from 'd3';
import { zipObject, difference, memoize } from 'lodash';
import { createSelector } from 'reselect';
import { colors } from '../../../../style/variables';
import {
  asMillisWithDefault,
  asDecimal,
  tpmUnit
} from '../../../../utils/formatters';

const getEmptySerie = memoize(
  (start = Date.now() - 3600000, end = Date.now()) => {
    const dates = d3.time
      .scale()
      .domain([new Date(start), new Date(end)])
      .ticks();

    return [
      {
        isEmpty: true,
        data: dates.map(x => ({
          x: x.getTime(),
          y: 1
        }))
      }
    ];
  },
  (...args) => args.join('_')
);

const getResponseTimeSeriesSelector = createSelector(
  data => data.dates,
  data => data.responseTimes.avg,
  data => data.responseTimes.p95,
  data => data.responseTimes.p99,
  data => data.weightedAverage,
  _getResponseTimeSeries
);

const getRpmSeriesSelector = createSelector(
  chartData => chartData.dates,
  chartData => chartData.tpmBuckets,
  (chartData, props) => props.transactionType,
  _getRpmSeries
);

export function getResponseTimeSeriesOrEmpty({ start, end, chartsData }) {
  return chartsData.totalHits === 0
    ? getEmptySerie(start, end)
    : getResponseTimeSeriesSelector(chartsData);
}

function _getResponseTimeSeries(dates, avg, p95, p99, weightedAverage) {
  return [
    {
      title: 'Avg.',
      data: getChartValues(dates, avg),
      legendValue: `${asMillisWithDefault(weightedAverage)}`,
      type: 'area',
      color: colors.apmBlue,
      areaColor: 'rgba(49, 133, 252, 0.1)' // apmBlue
    },
    {
      title: '95th percentile',
      titleShort: '95th',
      data: getChartValues(dates, p95),
      type: 'area',
      color: colors.apmYellow,
      areaColor: 'rgba(236, 174, 35, 0.1)' // apmYellow
    },
    {
      title: '99th percentile',
      titleShort: '99th',
      data: getChartValues(dates, p99),
      type: 'area',
      color: colors.apmOrange,
      areaColor: 'rgba(249, 133, 16, 0.1)' // apmOrange
    }
  ];
}

export function getRpmSeriesOrEmpty({
  start,
  end,
  chartsData,
  transactionType
}) {
  return chartsData.totalHits === 0
    ? getEmptySerie(start, end)
    : getRpmSeriesSelector(chartsData, { transactionType });
}

function _getRpmSeries(dates, tpmBuckets, transactionType) {
  const getColor = getColorByKey(tpmBuckets.map(({ key }) => key));

  return tpmBuckets.map(bucket => {
    return {
      title: bucket.key,
      data: getChartValues(dates, bucket.values),
      legendValue: `${asDecimal(bucket.avg)} ${tpmUnit(transactionType)}`,
      type: 'line',
      color: getColor(bucket.key)
    };
  });
}

function getColorByKey(keys) {
  const assignedColors = {
    'HTTP 2xx': colors.apmGreen,
    'HTTP 3xx': colors.apmYellow,
    'HTTP 4xx': colors.apmOrange,
    'HTTP 5xx': colors.apmRed2
  };

  const unknownKeys = difference(keys, Object.keys(assignedColors));
  const unassignedColors = zipObject(unknownKeys, [
    colors.apmBlue,
    colors.apmPurple,
    colors.apmPink,
    colors.apmTan,
    colors.apmRed,
    colors.apmBrown
  ]);

  return key => assignedColors[key] || unassignedColors[key];
}

function getChartValues(dates = [], yValues = []) {
  return dates.map((x, i) => ({
    x,
    y: yValues[i]
  }));
}
