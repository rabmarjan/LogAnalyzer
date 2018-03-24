import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { get, uniq } from 'lodash';
import Span from './Span';
import TimelineHeader from './TimelineHeader';
import { SPAN_ID } from '../../../../../../common/constants';
import { STATUS } from '../../../../../constants';
import { colors } from '../../../../../style/variables';
import {
  getPrimaryType,
  getSpanLabel,
  getColorByType
} from '../../../../../utils/formatters';
import { StickyContainer } from 'react-sticky';
import Timeline from '../../../../shared/charts/Timeline';
import EmptyMessage from '../../../../shared/EmptyMessage';

const Container = styled.div`
  transition: 0.1s padding ease;
  position: relative;
  overflow: hidden;
`;

const DroppedSpansContainer = styled.div`
  border-top: 1px solid #ddd;
  height: 43px;
  line-height: 43px;
  text-align: center;
  color: ${colors.gray2};
`;

const TIMELINE_HEADER_HEIGHT = 100;
const TIMELINE_MARGINS = {
  top: TIMELINE_HEADER_HEIGHT,
  left: 50,
  right: 50,
  bottom: 0
};

class Spans extends PureComponent {
  componentDidMount() {
    loadSpans(this.props);
  }

  componentWillReceiveProps(nextProps) {
    loadSpans(nextProps);
  }

  render() {
    const { spans, agentName, urlParams } = this.props;
    if (spans.status !== STATUS.SUCCESS) {
      return null;
    }

    if (spans.data.spans.length <= 0) {
      return (
        <EmptyMessage
          heading="No spans available for this transaction."
          showSubheading={false}
        />
      );
    }

    const spanTypes = uniq(
      spans.data.spanTypes.map(({ type }) => getPrimaryType(type))
    );

    const getSpanColor = getColorByType(spanTypes);

    const totalDuration = spans.data.duration;
    const spanContainerHeight = 58;
    const timelineHeight = spanContainerHeight * spans.data.spans.length;

    return (
      <div>
        <Container>
          <StickyContainer>
            <Timeline
              header={
                <TimelineHeader
                  legends={spanTypes.map(type => ({
                    label: getSpanLabel(type),
                    color: getSpanColor(type)
                  }))}
                  transactionName={urlParams.transactionName}
                />
              }
              duration={totalDuration}
              height={timelineHeight}
              margins={TIMELINE_MARGINS}
            />
            <div
              style={{
                paddingTop: TIMELINE_MARGINS.top
              }}
            >
              {spans.data.spans.map(span => (
                <Span
                  transactionId={urlParams.transactionId}
                  timelineMargins={TIMELINE_MARGINS}
                  key={get({ span }, SPAN_ID)}
                  color={getSpanColor(getPrimaryType(span.type))}
                  span={span}
                  spanTypes={spans.data.spanTypes}
                  totalDuration={totalDuration}
                  isSelected={get({ span }, SPAN_ID) === urlParams.spanId}
                />
              ))}
            </div>
          </StickyContainer>
        </Container>

        {this.props.droppedSpans > 0 && (
          <DroppedSpansContainer>
            {this.props.droppedSpans} spans dropped due to limit of{' '}
            {spans.data.spans.length}.{' '}
            <DocumentationLink agentName={agentName} />
          </DroppedSpansContainer>
        )}
      </div>
    );
  }
}

function DocumentationLink({ agentName }) {
  let url;

  switch (agentName) {
    case 'nodejs':
      url =
        'https://www.elastic.co/guide/en/apm/agent/nodejs/1.x/agent-api.html#transaction-max-spans';
      break;

    case 'python':
      url =
        'https://www.elastic.co/guide/en/apm/agent/python/2.x/configuration.html#config-transaction-max-spans';
      break;

    default:
      return null;
  }

  return (
    <a href={url} target="_blank">
      Learn more in the documentation.
    </a>
  );
}

function loadSpans(props) {
  const { serviceName, start, end, transactionId } = props.urlParams;
  if (serviceName && start && end && transactionId && !props.spansNext.status) {
    props.loadSpans({ serviceName, start, end, transactionId });
  }
}

export default Spans;
