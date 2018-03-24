import { scaleLinear } from 'd3-scale';

export function getPlotValues(duration, height, margins, width) {
  const xMin = 0;
  const xMax = duration;
  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .range([margins.left, width - margins.right]);

  return {
    height,
    margins,
    tickValues: xScale.ticks(7),
    width,
    xDomain: xScale.domain(),
    xMax,
    xScale
  };
}
