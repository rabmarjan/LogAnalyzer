import _ from 'lodash';
import { Voronoi } from 'react-vis';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { SharedPlot } from './plotUtils';

class VoronoiPlot extends PureComponent {
  render() {
    const { series, plotValues } = this.props;
    const { XY_MARGIN, XY_HEIGHT, XY_WIDTH, x } = plotValues;
    const defaultSerie = _.get(series, '[0]');
    const defaultSerieData = _.get(defaultSerie, 'data');
    if (!defaultSerieData || defaultSerie.isEmpty) {
      return null;
    }

    return (
      <SharedPlot
        plotValues={plotValues}
        onMouseLeave={this.props.onMouseLeave}
      >
        <Voronoi
          extent={[[XY_MARGIN.left, XY_MARGIN.top], [XY_WIDTH, XY_HEIGHT]]}
          nodes={defaultSerieData}
          onHover={this.props.onHover}
          onMouseDown={this.props.onMouseDown}
          onMouseUp={this.props.onMouseUp}
          x={d => x(d.x)}
          y={() => 0}
        />
      </SharedPlot>
    );
  }
}

export default VoronoiPlot;

VoronoiPlot.propTypes = {
  onHover: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  series: PropTypes.array.isRequired,
  plotValues: PropTypes.object.isRequired
};
