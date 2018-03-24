export class Settings {
  constructor(props) {
    this.actionTypes = props.actionTypes;
  }

  static fromUpstreamJson(json) {
    const actionTypes = json.action_types;
    const props = {
      actionTypes
    };
    return new Settings(props);
  }
}
