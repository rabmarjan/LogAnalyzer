import { badRequest } from 'boom';

export class BaseAction {
  constructor(props) {
    this.id = props.id;
    this.type = props.type;
  }

  get downstreamJson() {
    const result = {
      id: this.id,
      type: this.type
    };

    return result;
  }

  get upstreamJson() {
    const result = {};
    return result;
  }

  static getPropsFromDownstreamJson(json) {
    return {
      id: json.id
    };
  }

  static getPropsFromUpstreamJson(json) {
    if (!json.id) {
      throw badRequest('json argument must contain an id property');
    }

    return {
      id: json.id
    };
  }
}
