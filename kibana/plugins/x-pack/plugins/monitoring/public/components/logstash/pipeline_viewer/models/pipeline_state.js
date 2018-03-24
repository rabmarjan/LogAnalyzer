import { Config } from './config';

export class PipelineState {
  constructor(pipelineState) {
    this.config = new Config();
    this.update(pipelineState);
  }

  update(pipelineJson) {
    this.config.update(pipelineJson.representation);
  }
}
