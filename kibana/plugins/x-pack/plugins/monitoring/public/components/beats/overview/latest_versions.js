import React from 'react';
import {
  KuiTable,
  KuiTableRow,
  KuiTableRowCell,
  KuiTableBody,
} from 'ui_framework/components';

export function LatestVersions({ latestVersions }) {
  const versions = latestVersions.map(({ version, count }, index) => {
    return (
      <KuiTableRow key={`latest-version-${index}`}>
        <KuiTableRowCell>{version}</KuiTableRowCell>
        <KuiTableRowCell align="right">{count}</KuiTableRowCell>
      </KuiTableRow>
    );
  });

  return (
    <KuiTable>
      <KuiTableBody>
        {versions}
      </KuiTableBody>
    </KuiTable>
  );
}
