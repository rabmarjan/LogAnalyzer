import { uiModules } from 'ui/modules';
import template from './password_form.html';

const module = uiModules.get('security', ['kibana']);
module.directive('kbnPasswordForm', function () {
  return {
    template,
    scope: {
      password: '=',
    },
    restrict: 'E',
    replace: true,
    controllerAs: 'passwordController',
    controller: function () {
      this.confirmation = null;
    },
  };
});
