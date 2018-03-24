import { set } from 'lodash';
import { badRequest } from 'boom';
import { getActionType } from '../../../common/lib/get_action_type';
import { ACTION_TYPES } from '../../../common/constants';
import { LoggingAction } from './logging_action';
import { EmailAction } from './email_action';
import { SlackAction } from './slack_action';
import { UnknownAction } from './unknown_action';

const ActionTypes = {};
set(ActionTypes, ACTION_TYPES.LOGGING, LoggingAction);
set(ActionTypes, ACTION_TYPES.EMAIL, EmailAction);
set(ActionTypes, ACTION_TYPES.SLACK, SlackAction);
set(ActionTypes, ACTION_TYPES.UNKNOWN, UnknownAction);

export class Action {
  static getActionTypes = () => {
    return ActionTypes;
  }

  // From Elasticsearch
  static fromUpstreamJson(json) {
    if (!json.actionJson) {
      throw badRequest('json argument must contain an actionJson property');
    }

    const type = getActionType(json.actionJson);
    const ActionType = ActionTypes[type] || UnknownAction;
    return ActionType.fromUpstreamJson(json);
  }

  // From Kibana
  static fromDownstreamJson(json) {
    const ActionType = ActionTypes[json.type] || UnknownAction;

    return ActionType.fromDownstreamJson(json);
  }
}
