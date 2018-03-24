import React from 'react';
import {
  KuiToolBarSection,
  KuiToolBarText,
} from 'ui_framework/components';
import { TABLE_ACTION_RESET_PAGING } from 'monitoring-constants';

export class ShowSytemIndicesCheckbox extends React.Component {
  constructor(props) {
    super();
    this.state = { showSystemIndices: props.showSystemIndices };
    this.toggleShowSystemIndices = this.toggleShowSystemIndices.bind(this);
  }
  // See also directives/shard_allocation/components/tableHead
  toggleShowSystemIndices(e) {
    const isChecked = Boolean(e.target.checked);
    this.setState({ showSystemIndices: isChecked });
    this.props.toggleShowSystemIndices(isChecked);
    this.props.dispatchTableAction(TABLE_ACTION_RESET_PAGING);
  }
  render() {
    return (
      <KuiToolBarSection>
        <KuiToolBarText>
          <label className="kuiCheckBoxLabel">
            <input
              className="kuiCheckBox"
              type="checkbox"
              onChange={this.toggleShowSystemIndices}
              checked={this.state.showSystemIndices}
            />
            <span className="kuiCheckBoxLabel__text">Show system indices</span>
          </label>
        </KuiToolBarText>
      </KuiToolBarSection>
    );
  }
}
