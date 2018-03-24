export function getPhantomOptions({ bridgePort, phantomPath }) {
  return {
    parameters: {
      'load-images': true,
      'ssl-protocol': 'any',
      'ignore-ssl-errors': true,
    },
    path: phantomPath,
    bridge: {
      port: bridgePort
    },
  };
}