import React from 'react';
import {
  EuiTitle,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';

export function NoData() {
  return (
    <div className="page-row" data-test-subj="noData">
      <EuiText>
        <EuiTitle size="l">
          <h1>No Monitoring Data Found</h1>
        </EuiTitle>

        <EuiSpacer size="m" />

        <p>
          No Monitoring data is available for the selected time period.  This
          could be because no data is being sent to the cluster or data was not
          received during that time.
        </p>

        <p>
          Try adjusting the time filter controls to a time range where the
          Monitoring data is expected.
        </p>
      </EuiText>
    </div>
  );
}
