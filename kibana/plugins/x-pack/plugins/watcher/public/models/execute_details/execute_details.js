export class ExecuteDetails {
  constructor(props = {}) {
    this.triggeredTime = props.triggeredTime;
    this.scheduledTime = props.scheduledTime;
    this.ignoreCondition = props.ignoreCondition;
    this.alternativeInput = props.alternativeInput;
    this.actionModes = props.actionModes;
    this.recordExecution = props.recordExecution;
  }

  get upstreamJson() {
    const triggerData = {
      triggeredTime: this.triggeredTime,
      scheduledTime: this.scheduledTime,
    };

    return {
      triggerData: triggerData,
      ignoreCondition: this.ignoreCondition,
      alternativeInput: this.alternativeInput,
      actionModes: this.actionModes,
      recordExecution: this.recordExecution
    };
  }
}
