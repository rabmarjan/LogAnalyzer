import React, { Component } from 'react';

import { STATUS } from '../../../constants';
import { loadServerStatus, loadAgentStatus } from '../../../services/rest';
import { serverInstructions, agentInstructions } from './instruction_sets';

import Introduction from './Introduction';
import StepSet from './StepSet';
import CompleteSetup from './CompleteSetup';

class SetupInstructions extends Component {
  state = {
    server: {
      status: null,
      completed: null
    },
    agent: {
      status: null,
      completed: null
    }
  };

  serverStatusCheck = () => {
    this.setState({ server: { status: STATUS.LOADING } });
    loadServerStatus()
      .then(result => {
        this.setState({
          server: {
            status: STATUS.SUCCESS,
            completed: result.dataFound
          }
        });
      })
      .catch(() => {
        this.setState({
          server: {
            status: STATUS.FAILURE
          }
        });
      });
  };

  agentStatusCheck = () => {
    this.setState({ agent: { status: STATUS.LOADING } });
    loadAgentStatus()
      .then(result => {
        this.setState({
          agent: {
            status: STATUS.SUCCESS,
            completed: result.dataFound
          }
        });
      })
      .catch(() => {
        this.setState({
          agent: {
            status: STATUS.FAILURE
          }
        });
      });
  };

  render() {
    const { server, agent } = this.state;

    return (
      <div>
        <Introduction />
        <div>
          <StepSet
            type="APM Server"
            instructions={serverInstructions}
            checkStatus={this.serverStatusCheck}
            result={server}
          />

          <StepSet
            type="APM agent"
            instructions={agentInstructions}
            checkStatus={this.agentStatusCheck}
            result={agent}
          />

          <CompleteSetup results={this.state} />
        </div>
      </div>
    );
  }
}

export default SetupInstructions;
