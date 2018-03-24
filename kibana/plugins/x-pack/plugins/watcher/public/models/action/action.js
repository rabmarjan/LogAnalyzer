import { get, set } from 'lodash';
import { ACTION_TYPES } from 'plugins/watcher/../common/constants';
import { EmailAction } from './email_action';
import { LoggingAction } from './logging_action';
import { SlackAction } from './slack_action';
import { UnknownAction } from './unknown_action';

const ActionTypes = {};
set(ActionTypes, ACTION_TYPES.EMAIL, EmailAction);
set(ActionTypes, ACTION_TYPES.LOGGING, LoggingAction);
set(ActionTypes, ACTION_TYPES.SLACK, SlackAction);

export class Action {
  static getActionTypes = () => {
    return ActionTypes;
  }

  static fromUpstreamJson(upstreamAction) {
    const type = get(upstreamAction, 'type');
    const ActionType = ActionTypes[type] || UnknownAction;

    return ActionType.fromUpstreamJson(upstreamAction);
  }
}
