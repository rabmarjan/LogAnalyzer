import { Graph } from './graph';

export class Config {
  constructor() {
    this.graph = new Graph();
  }

  update(configJson) {
    this.json = configJson;
    this.graph.update(configJson.graph);
  }
}
