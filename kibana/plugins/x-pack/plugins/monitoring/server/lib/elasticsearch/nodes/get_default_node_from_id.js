/*
 * LEGACY: we need to handle legacy data with some workaround values
 * If node information can't be retrieved, we call this function
 * that provides some usable defaults
 */
export function getDefaultNodeFromId(nodeId) {
  return {
    id: nodeId,
    name: nodeId,
    transport_address: '',
    master: false,
    type: 'node',
    attributes: {}
  };
}
