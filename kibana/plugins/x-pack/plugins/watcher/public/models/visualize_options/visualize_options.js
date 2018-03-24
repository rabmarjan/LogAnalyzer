export class VisualizeOptions {
  constructor(props = {}) {
    this.rangeFrom = props.rangeFrom;
    this.rangeTo = props.rangeTo;
    this.interval = props.interval;
    this.timezone = props.timezone;
  }

  get upstreamJson() {
    return {
      rangeFrom: this.rangeFrom,
      rangeTo: this.rangeTo,
      interval: this.interval,
      timezone: this.timezone
    };
  }
}
