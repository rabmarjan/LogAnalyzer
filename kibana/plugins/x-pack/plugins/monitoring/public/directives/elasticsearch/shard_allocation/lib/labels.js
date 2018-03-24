/**
 * ELASTICSEARCH CONFIDENTIAL
 * _____________________________
 *
 *  [2014] Elasticsearch Incorporated All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Elasticsearch Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Elasticsearch Incorporated.
 */

// The ui had different columns in different order depending on the
// $scope.view variable. This provides a lookup for the column headers
export const labels = {
  // "index detail" page shows nodes on which index shards are allocated
  index: [
    { content: 'Nodes' }
  ],
  indexWithUnassigned: [
    { content: 'Unassigned' },
    { content: 'Nodes' }
  ],
  // "node detail" page shows the indexes that have shards on this node
  node: [
    {
      content: 'Indices',
      showToggleSystemIndicesComponent: true // tell the TableHead component to inject checkbox JSX to show/hide system indices
    }
  ]
};
