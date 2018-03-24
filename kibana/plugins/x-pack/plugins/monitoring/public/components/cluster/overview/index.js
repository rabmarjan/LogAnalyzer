import React from 'react';
import { ElasticsearchPanel } from './elasticsearch_panel';
import { LicenseText } from './license_text';
import { KibanaPanel } from './kibana_panel';
import { LogstashPanel } from './logstash_panel';
import { AlertsPanel } from './alerts_panel';
import { BeatsPanel } from './beats_panel';

import {
  EuiPage,
} from '@elastic/eui';

export function Overview(props) {
  return (
    <EuiPage>

      <LicenseText
        license={props.cluster.license}
        showLicenseExpiration={props.showLicenseExpiration}
        changeUrl={props.changeUrl}
      />

      <AlertsPanel alerts={props.cluster.alerts} changeUrl={props.changeUrl}/>

      <ElasticsearchPanel {...props.cluster.elasticsearch} ml={props.cluster.ml} changeUrl={props.changeUrl}/>

      <KibanaPanel {...props.cluster.kibana} changeUrl={props.changeUrl}/>

      <LogstashPanel {...props.cluster.logstash} changeUrl={props.changeUrl}/>

      <BeatsPanel {...props.cluster.beats} changeUrl={props.changeUrl}/>

    </EuiPage>
  );
}
