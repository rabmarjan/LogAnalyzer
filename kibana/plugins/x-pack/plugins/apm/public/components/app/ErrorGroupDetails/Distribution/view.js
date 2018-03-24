import React, { Component } from 'react';
import Histogram from '../../../shared/charts/Histogram';
import EmptyMessage from '../../../shared/EmptyMessage';
import { GraphHeader } from '../../../shared/UIComponents';

export function getFormattedBuckets(buckets, bucketSize) {
  if (!buckets) {
    return null;
  }

  return buckets.map(({ count, key }) => {
    return {
      x0: key,
      x: key + bucketSize,
      y: count
    };
  });
}

function loadErrorDistribution(props) {
  const { serviceName, start, end, errorGroupId } = props.urlParams;

  if (
    serviceName &&
    start &&
    end &&
    errorGroupId &&
    !props.distribution.status
  ) {
    props.loadErrorDistribution({ serviceName, start, end, errorGroupId });
  }
}

class Distribution extends Component {
  componentDidMount() {
    loadErrorDistribution(this.props);
  }

  componentWillReceiveProps(nextProps) {
    loadErrorDistribution(nextProps);
  }

  render() {
    const { distribution } = this.props;
    const buckets = getFormattedBuckets(
      distribution.data.buckets,
      distribution.data.bucketSize
    );

    const isEmpty = distribution.data.totalHits === 0;

    if (isEmpty) {
      return <EmptyMessage heading="No errors in the selected time range." />;
    }

    return (
      <div>
        <GraphHeader>Occurrences</GraphHeader>
        <Histogram
          verticalLineHover={bucket => bucket.x}
          xType="time"
          buckets={buckets}
          bucketSize={distribution.data.bucketSize}
          formatYValue={value => `${value} occ.`}
        />
      </div>
    );
  }
}

export default Distribution;
