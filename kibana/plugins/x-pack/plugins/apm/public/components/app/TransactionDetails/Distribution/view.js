import React, { Component } from 'react';
import d3 from 'd3';
import Histogram from '../../../shared/charts/Histogram';
import { toQuery, fromQuery } from '../../../../utils/url';
import { withRouter } from 'react-router-dom';
import { GraphHeader } from '../../../shared/UIComponents';
import EmptyMessage from '../../../shared/EmptyMessage';
import { getTimeFormatter, timeUnit } from '../../../../utils/formatters';
import SamplingTooltip from './SamplingTooltip';

export function getFormattedBuckets(buckets, bucketSize) {
  if (!buckets) {
    return null;
  }

  return buckets.map(({ sampled, count, key, transactionId }) => {
    return {
      sampled,
      transactionId,
      x0: key,
      x: key + bucketSize,
      y: count,
      style: count > 0 && sampled ? { cursor: 'pointer' } : {}
    };
  });
}

function loadTransactionDistribution(props) {
  const { serviceName, start, end, transactionName } = props.urlParams;

  if (
    serviceName &&
    start &&
    end &&
    transactionName &&
    !props.distribution.status
  ) {
    props.loadTransactionDistribution({
      serviceName,
      start,
      end,
      transactionName
    });
  }
}

class Distribution extends Component {
  componentDidMount() {
    loadTransactionDistribution(this.props);
  }

  componentWillReceiveProps(nextProps) {
    loadTransactionDistribution(nextProps);
  }

  formatYValue = t => {
    return `${t} ${distributionUnit(this.props.urlParams.transactionType)}`;
  };

  render() {
    const { history, location, distribution } = this.props;
    const buckets = getFormattedBuckets(
      distribution.data.buckets,
      distribution.data.bucketSize
    );

    const isEmpty = distribution.data.totalHits === 0;
    const xMax = d3.max(buckets, d => d.x);
    const timeFormatter = getTimeFormatter(xMax);
    const unit = timeUnit(xMax);

    if (isEmpty) {
      return (
        <EmptyMessage heading="No transactions in the selected time range." />
      );
    }

    return (
      <div>
        <GraphHeader>
          Response time distribution <SamplingTooltip />
        </GraphHeader>
        <Histogram
          buckets={buckets}
          bucketSize={distribution.data.bucketSize}
          transactionId={this.props.urlParams.transactionId}
          onClick={bucket => {
            if (bucket.sampled && bucket.y > 0) {
              history.replace({
                ...location,
                search: fromQuery({
                  ...toQuery(location.search),
                  transactionId: bucket.transactionId
                })
              });
            }
          }}
          formatXValue={timeFormatter}
          formatYValue={this.formatYValue}
          verticalLineHover={bucket => bucket.y > 0 && !bucket.sampled}
          backgroundHover={bucket => bucket.y > 0 && bucket.sampled}
          tooltipHeader={bucket =>
            `${timeFormatter(bucket.x0, false)} - ${timeFormatter(
              bucket.x,
              false
            )} ${unit}`
          }
          tooltipFooter={bucket =>
            !bucket.sampled && 'No sample available for this bucket'
          }
        />
      </div>
    );
  }
}

function distributionUnit(type) {
  return type === 'request' ? 'req.' : 'trans.';
}

export default withRouter(Distribution);
