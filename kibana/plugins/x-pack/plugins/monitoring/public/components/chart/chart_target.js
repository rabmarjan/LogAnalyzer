import _ from 'lodash';
import React from 'react';
import $ from 'jquery-flot'; // webpackShim
import { eventBus } from './event_bus';
import { getChartOptions } from './get_chart_options';

const RESIZE_TIMEOUT = 250; // resize handler to execute at a rate of 4fps

export class ChartTarget extends React.Component {
  shouldComponentUpdate() {
    return !this.plot;
  }

  shutdownChart() {
    if (!this.plot) { return; }

    const { target } = this.refs;
    $(target).off('plothover');
    $(target).off('mouseleave');
    $(target).off('plotselected');
    $(target).off('plotselecting');

    this.plot.shutdown();

    eventBus.off('thorPlotHover');
    eventBus.off('thorPlotLeave');
    eventBus.off('thorPlotSelecting');
    eventBus.off('thorPlotBrush');
  }

  componentWillUnmount() {
    this.shutdownChart();
    window.removeEventListener('resize', this.resizeThrottler);
  }

  filterByShow(seriesToShow) {
    if (seriesToShow) {
      return (metric) => {
        return seriesToShow.some(id => _.startsWith(id, metric.id));
      };
    }
    return (_metric) => true;
  }

  componentWillReceiveProps(newProps) {
    if (this.plot && !_.isEqual(newProps, this.props)) {
      const { series, timeRange } = newProps;

      const xaxisOptions = this.plot.getAxes().xaxis.options;
      xaxisOptions.min = _.get(timeRange, 'min');
      xaxisOptions.max = _.get(timeRange, 'max');

      this.plot.setData(this.filterData(series, newProps.seriesToShow));
      this.plot.setupGrid();
      this.plot.draw();
    }
  }

  componentDidMount() {
    this.renderChart();
    window.addEventListener('resize', this.resizeThrottler, false);

    // resizes legend container after each series is initialized
    this.resizeThrottler();
  }

  componentDidUpdate() {
    this.shutdownChart();
    this.renderChart();
  }

  filterData(data, seriesToShow) {
    return _(data)
      .filter(this.filterByShow(seriesToShow))
      .value();
  }

  getOptions() {
    const opts = getChartOptions({
      yaxis: { tickFormatter: this.props.tickFormatter },
      xaxis: this.props.timeRange
    });

    return _.assign(opts, this.props.options);
  }

  renderChart() {
    const { target } = this.refs;
    const { series } = this.props;
    const data = this.filterData(series, this.props.seriesToShow);

    this.plot = $.plot(target, data, this.getOptions());

    this._handleResize = () => {
      if (!this.plot) { return; }

      try {
        this.plot.resize();
        this.plot.setupGrid();
        this.plot.draw();
      }
      catch (e) { // eslint-disable-line no-empty
        /* It is ok to silently swallow the error here. Resize events fire
         * continously so the proper resize will happen in a later firing of
         * the event */
      }
    };

    // simulate the "end" of the resize action
    // needs setTimeout/clearTimeout since resize events are continous
    // http://stackoverflow.com/a/5490021
    let resizeTimeout;
    this.resizeThrottler = () => {
      resizeTimeout = window.setTimeout(() => {
        clearTimeout(resizeTimeout);
        this._handleResize(); // actual resize handler
      }, RESIZE_TIMEOUT);
    };

    this.handleMouseLeave = () => {
      eventBus.trigger('thorPlotLeave', []);
    };

    this.handlePlotHover = (_event, pos, item) => {
      eventBus.trigger('thorPlotHover', [pos, item, this.plot]);
    };

    this.handleThorPlotHover = (_event, pos, item, originalPlot) => {
      if (this.plot !== originalPlot) {
        // the crosshair is set for the original chart already
        this.plot.setCrosshair({ x: _.get(pos, 'x') });
      }
      this.props.updateLegend(pos, item);
    };

    this.handleThorPlotLeave = () => {
      this.plot.clearCrosshair();
      this.props.updateLegend(); // gets last values
    };

    this.handleThorPlotSelecting = (_event, xaxis, originalPlot) => {
      if (this.plot !== originalPlot) {
        const preventEvent = true;
        this.plot.setSelection({ xaxis }, preventEvent);
      }
    };

    this.handleThorPlotBrush = () => {
      this.plot.clearSelection();
    };

    this.selectingChart = (_event, ranges) => {
      if (ranges) {
        const xaxis = ranges.xaxis;
        eventBus.trigger('thorPlotSelecting', [xaxis, this.plot]);
      }
    };

    this.brushChart = (_event, ranges) => {
      this.props.onBrush(ranges);
      eventBus.trigger('thorPlotBrush');
    };

    $(target).on('plothover', this.handlePlotHover);
    $(target).on('mouseleave', this.handleMouseLeave);
    $(target).on('plotselected', this.brushChart);
    $(target).on('plotselecting', this.selectingChart);

    eventBus.on('thorPlotHover', this.handleThorPlotHover);
    eventBus.on('thorPlotLeave', this.handleThorPlotLeave);
    eventBus.on('thorPlotSelecting', this.handleThorPlotSelecting);
    eventBus.on('thorPlotBrush', this.handleThorPlotBrush);
  }

  render() {
    const style = {
      position: 'relative',
      display: 'flex',
      rowDirection: 'column',
      flex: '1 0 auto'
    };

    return (
      <div ref="target" style={style} />
    );
  }
}
