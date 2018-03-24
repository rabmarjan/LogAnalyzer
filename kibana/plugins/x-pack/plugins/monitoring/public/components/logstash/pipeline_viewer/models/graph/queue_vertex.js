import { Vertex } from './vertex';
import queueIcon from 'plugins/monitoring/icons/logstash/queue.svg';

export class QueueVertex extends Vertex {
  get typeString() {
    return 'queue';
  }

  get title() {
    return 'queue';
  }

  get icon() {
    return queueIcon;
  }
}
