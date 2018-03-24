import React from 'react';
import {
  KuiTable,
  KuiTableRow,
  KuiTableRowCell,
  KuiTableBody,
} from 'ui_framework/components';

export function LatestTypes({ latestTypes }) {
  const types = latestTypes.map(({ type, count }, index) => {
    return (
      <KuiTableRow key={`latest-types-${index}`}>
        <KuiTableRowCell>{type}</KuiTableRowCell>
        <KuiTableRowCell align="right">{count}</KuiTableRowCell>
      </KuiTableRow>
    );
  });

  return (
    <KuiTable>
      <KuiTableBody>
        {types}
      </KuiTableBody>
    </KuiTable>
  );
}
