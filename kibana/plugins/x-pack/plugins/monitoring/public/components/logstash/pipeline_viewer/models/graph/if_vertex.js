import { Vertex } from './vertex';
import ifIcon from 'plugins/monitoring/icons/logstash/if.svg';

export class IfVertex extends Vertex {
  get typeString() {
    return 'if';
  }

  get name() {
    return this.json.condition;
  }

  get icon() {
    return ifIcon;
  }

  get title() {
    return 'if';
  }

  get subtitle() {
    return {
      complete: this.name,
      display: this.truncateStringForDisplay(this.name, this.displaySubtitleMaxLength)
    };
  }

  get displaySubtitleMaxLength() {
    return 39;
  }
}
