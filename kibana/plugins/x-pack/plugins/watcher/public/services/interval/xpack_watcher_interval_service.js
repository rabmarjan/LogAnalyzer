export class XpackWatcherIntervalService {
  constructor(timeBuckets) {
    this.timeBuckets = timeBuckets;
  }

  getInterval(input) {
    this.timeBuckets.setBounds(input);
    return this.timeBuckets.getInterval();
  }
}
