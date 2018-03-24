import { PlainEdge } from './plain_edge';
import { BooleanEdge } from './boolean_edge';

export function edgeFactory(graph, edgeJson) {
  const type = edgeJson.type;
  switch (type) {
    case 'plain':
      return new PlainEdge(graph, edgeJson);
    case 'boolean':
      return new BooleanEdge(graph, edgeJson);
    default:
      throw new Error(`Unknown edge type ${type}! This shouldn't happen!`);
  }
}