import { Edge } from './edge';

export class PlainEdge extends Edge {
  get svgClass() {
    return `${super.svgClass} ${super.svgClass}Plain`;
  }
}
