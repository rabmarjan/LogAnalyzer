import React from 'react';
import {
  KuiEmptyTablePromptPanel,
  KuiTableInfo
} from 'ui_framework/components';

export function MonitoringTableNoData({ message }) {
  return (
    <KuiEmptyTablePromptPanel data-test-subj="monitoringTableNoData">
      <KuiTableInfo>
        { message }
      </KuiTableInfo>
    </KuiEmptyTablePromptPanel>
  );
}
