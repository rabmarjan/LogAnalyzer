import { Vertex } from './vertex';
import inputIcon from 'plugins/monitoring/icons/logstash/input.svg';
import filterIcon from 'plugins/monitoring/icons/logstash/filter.svg';
import outputIcon from 'plugins/monitoring/icons/logstash/output.svg';

export const TIME_CONSUMING_PROCESSOR_THRESHOLD_COEFFICIENT = 2;
export const SLOWNESS_STANDARD_DEVIATIONS_ABOVE_THE_MEAN = 2;

export class PluginVertex extends Vertex {
  get typeString() {
    return 'plugin';
  }

  get name() {
    return this.json.config_name;
  }

  get title() {
    return this.name;
  }

  get pluginType() {
    return this.json.plugin_type;
  }

  get isInput() {
    return this.pluginType === 'input';
  }

  get isProcessor() {
    return (this.pluginType === 'filter' || this.pluginType === 'output');
  }

  get millisPerEvent() {
    return this.stats.millis_per_event;
  }

  get percentOfTotalProcessorTime() {
    return this.stats.percent_of_total_processor_duration;
  }

  get eventsPerSecond() {
    return this.stats.events_per_millisecond * 1000;
  }

  isTimeConsuming() {
    // We assume that a 'normal' processor takes an equal share of execution time
    const expectedPercentOfTotalProcessorTime = 1 / this.graph.processorVertices.length;

    // If a processor takes more than some threshold beyond that it may be slow
    const threshold = TIME_CONSUMING_PROCESSOR_THRESHOLD_COEFFICIENT * expectedPercentOfTotalProcessorTime;

    return this.percentOfTotalProcessorTime > threshold;
  }

  isSlow() {
    const totalProcessorVertices = this.graph.processorVertices.length;

    if (totalProcessorVertices === 0) {
      return 0;
    }

    const meanmillisPerEvent = this.graph.processorVertices.reduce((acc, v) => {
      return acc + v.millisPerEvent || 0;
    }, 0) / totalProcessorVertices;

    const variance = this.graph.processorVertices.reduce((acc, v) => {
      const difference = (v.millisPerEvent || 0) - meanmillisPerEvent;
      const square = difference * difference;
      return acc + square;
    }, 0) / totalProcessorVertices;

    const stdDeviation = Math.sqrt(variance);

    // Std deviations above the mean
    const slowness = (this.millisPerEvent - meanmillisPerEvent) / stdDeviation;

    return slowness > SLOWNESS_STANDARD_DEVIATIONS_ABOVE_THE_MEAN;
  }

  get icon() {
    switch(this.pluginType) {
      case 'input':
        return inputIcon;
      case 'filter':
        return filterIcon;
      case 'output':
        return outputIcon;
      default:
        throw new Error(`Unknown plugin type ${this.pluginType}! This shouldn't happen!`);
    }
  }
}
