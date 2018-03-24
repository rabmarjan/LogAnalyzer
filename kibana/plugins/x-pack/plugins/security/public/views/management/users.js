import _ from 'lodash';
import routes from 'ui/routes';
import { toggle, toggleSort } from 'plugins/security/lib/util';
import template from 'plugins/security/views/management/users.html';
import 'plugins/security/services/shield_user';
import { checkLicenseError } from 'plugins/security/lib/check_license_error';
import { GateKeeperProvider } from 'plugins/xpack_main/services/gate_keeper';
import { SECURITY_PATH, USERS_PATH, EDIT_USERS_PATH, EDIT_ROLES_PATH } from './management_urls';

routes.when(SECURITY_PATH, {
  redirectTo: USERS_PATH
});

routes.when(USERS_PATH, {
  template,
  resolve: {
    tribeRedirect(Private) {
      const gateKeeper = Private(GateKeeperProvider);
      gateKeeper.redirectAndNotifyIfTribe();
    },

    users(ShieldUser, kbnUrl, Promise, Private) {
      // $promise is used here because the result is an ngResource, not a promise itself
      return ShieldUser.query().$promise
        .catch(checkLicenseError(kbnUrl, Promise, Private))
        .catch(_.identity); // Return the error if there is one
    }
  },

  controller($scope, $route, $q, Notifier, confirmModal) {
    $scope.users = $route.current.locals.users;
    $scope.forbidden = !_.isArray($scope.users);
    $scope.selectedUsers = [];
    $scope.sort = { orderBy: 'full_name', reverse: false };
    $scope.editUsersHref = `#${EDIT_USERS_PATH}`;
    $scope.getEditUrlHref = (user) => `#${EDIT_USERS_PATH}/${user}`;
    $scope.getEditRoleHref = (role) => `#${EDIT_ROLES_PATH}/${role}`;

    const notifier = new Notifier();

    $scope.deleteUsers = () => {
      const doDelete = () => {
        $q.all($scope.selectedUsers.map((user) => user.$delete()))
          .then(() => notifier.info('The user(s) have been deleted.'))
          .then(() => {
            $scope.selectedUsers.map((user) => {
              const i = $scope.users.indexOf(user);
              $scope.users.splice(i, 1);
            });
            $scope.selectedUsers.length = 0;
          });
      };
      const confirmModalOptions = {
        onConfirm: doDelete,
        confirmButtonText: 'Delete user(s)'
      };
      confirmModal(
        'Are you sure you want to delete the selected user(s)? This action is irreversible!',
        confirmModalOptions
      );
    };

    $scope.getSortArrowClass = field => {
      if ($scope.sort.orderBy === field) {
        return $scope.sort.reverse ? 'fa-long-arrow-down' : 'fa-long-arrow-up';
      }

      // Sort ascending by default.
      return 'fa-long-arrow-up';
    };

    $scope.toggleAll = () => {
      if ($scope.allSelected()) {
        $scope.selectedUsers.length = 0;
      } else {
        $scope.selectedUsers = getActionableUsers().slice();
      }
    };

    $scope.allSelected = () => {
      const users = getActionableUsers();
      return users.length && users.length === $scope.selectedUsers.length;
    };

    $scope.toggle = toggle;
    $scope.includes = _.includes;
    $scope.toggleSort = toggleSort;

    function getActionableUsers() {
      return $scope.users.filter((user) => !user.metadata._reserved);
    }
  }
});
