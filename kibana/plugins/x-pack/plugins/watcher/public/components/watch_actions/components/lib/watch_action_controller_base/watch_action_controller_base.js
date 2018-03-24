export class WatchActionControllerBase {
  constructor($scope) {
    this.action = $scope.action;
    this.form = $scope.form;
    this.onChange = $scope.onChange;
  }

  isValidationMessageVisible = (fieldName, errorType) => {
    return this.form[fieldName].$touched &&
      this.form[fieldName].$error[errorType];
  }
}
