import React from 'react';

import {
  KuiCard,
  KuiCardFooter,
  KuiCardDescription,
  KuiCardDescriptionText,
  KuiCardDescriptionTitle
} from 'ui_framework/components';
import { ExternalLink } from '../external_link';

export class SubscriptionRegistration extends React.PureComponent {
  render() {
    const { couldUpgrade } = this.props;
    if (!couldUpgrade) {
      return null;
    }
    return (
      <KuiCard>
        <KuiCardDescription>
          <KuiCardDescriptionTitle>
            Unlock the Full Functionality
          </KuiCardDescriptionTitle>
          <KuiCardDescriptionText>
            Get all X-Pack has to offer: security, monitoring, alerting, reporting,
             and Graph, plus support from the engineers behind the Elastic Stack.
          </KuiCardDescriptionText>
        </KuiCardDescription>
        <KuiCardFooter>
          <ExternalLink
            className="kuiButton kuiButton--primary"
            href="https://www.elastic.co/subscriptions/xpack"
          >
            Get It All
          </ExternalLink>
        </KuiCardFooter>
      </KuiCard>
    );
  }
}
