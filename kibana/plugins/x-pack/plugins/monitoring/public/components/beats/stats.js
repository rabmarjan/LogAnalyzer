import { get } from 'lodash';
import React from 'react';
import { formatMetric } from 'plugins/monitoring/lib/format_number';

export function Stats({ stats }) {
  const types = stats.types.map(({ type, count }, index) => {
    return (
      <div
        key={`type-${index}`}
        data-test-subj="typeCount"
        data-test-type-count={type + ':' + count}
      >
        {type}: <strong>{formatMetric(count, 'int_commas')}</strong>
      </div>
    );
  });

  return (
    <div className="monitoring-summary-status">
      <div
        className="monitoring-summary-status__content"
        data-test-subj="beatsSummaryStatus"
      >
        <div>
          Total Beats:&nbsp;
          <strong data-test-subj="totalBeats">
            {formatMetric(get(stats, 'total'), 'int_commas')}
          </strong>
        </div>
        {types}
        <div>
          Total Events:&nbsp;
          <strong data-test-subj="totalEvents">
            {formatMetric(get(stats, 'stats.totalEvents'), '0.[0]a')}
          </strong>
        </div>
        <div>
          Bytes Sent:&nbsp;
          <strong data-test-subj="bytesSent">
            {formatMetric(get(stats, 'stats.bytesSent'), 'bytes')}
          </strong>
        </div>
      </div>
    </div>
  );
}
