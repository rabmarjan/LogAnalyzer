export class VisualizeOptions {
  constructor(props) {
    this.rangeFrom = props.rangeFrom;
    this.rangeTo = props.rangeTo;
    this.interval = props.interval;
    this.timezone = props.timezone;
  }

  // generate ExecuteDetails object from kibana response
  static fromDownstreamJson(downstreamJson) {
    return new VisualizeOptions(downstreamJson);
  }
}

