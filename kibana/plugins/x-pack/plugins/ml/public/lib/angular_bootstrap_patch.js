/*
 * ELASTICSEARCH CONFIDENTIAL
 *
 * Copyright (c) 2017 Elasticsearch BV. All Rights Reserved.
 *
 * Notice: this software, and all information contained
 * therein, is the exclusive property of Elasticsearch BV
 * and its licensors, if any, and is protected under applicable
 * domestic and foreign law, and international treaties.
 *
 * Reproduction, republication or distribution without the
 * express written consent of Elasticsearch BV is
 * strictly prohibited.
 */

// the version of angular bootstrap ui included in kibana is old (0.12.1)
// this file contains patches for a couple of the directives to add
// functionality which has been added to later versions of angular bootstrap ui.

// to allow html or templates to be used as the content of popovers
// we have to manually add this functionality as a custom directive
import 'ui-bootstrap';
import angular from 'angular';
angular.module('ui.bootstrap.popover')
  .directive('popoverHtmlUnsafePopup', function ($compile) {
    let template = '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">';
    template += '<div class="arrow"></div>';
    template += '<div class="popover-inner">';
    template += '<h3 class="popover-title" bind-html-unsafe="title" ng-show="title"></h3>';
    template += '<div class="popover-content" bind-html-unsafe="content" ></div>';
    template += '</div></div>';
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        title: '@',
        content: '@',
        placement: '@',
        animation: '&',
        isOpen: '&'
      },
      template: template,
      link: function (scope, element) {
        // The content of the popup is added as a string and does not run through angular's templating system.
        // therefore {{stuff}} substitutions don't happen.
        // we have to manually apply the template, compile it with this scope and then set it as the html
        scope.$apply();
        const cont = $compile(scope.content)(scope);
        element.find('.popover-content').html(cont);

        // function to force the popover to close
        scope.closePopover = function () {
          scope.$parent.$parent.isOpen = false;
          scope.$parent.$parent.$applyAsync();
          element.remove();
        };
      }
    };
  })
  .directive('popoverHtmlUnsafe', ['$tooltip', function ($tooltip) {
    return $tooltip('popoverHtmlUnsafe', 'popover', 'click');
  }]);

// adds support dropdown-append-to-body, added in 0.13.1, allowing the dropdown
// menu to be appended to be the body and for the menu to be right aligned to the dropdown
// (by addition of the dropdown-menu-right class to the dropdown-menu)
angular.module('ui.bootstrap.dropdown', ['ui.bootstrap.position'])
  .constant('dropdownConfig', {
    openClass: 'open'
  })

  .service('dropdownService', ['$document', '$rootScope', function ($document, $rootScope) {
    let openScope = null;

    const closeDropdown = function (evt) {
    // This method may still be called during the same mouse event that
    // unbound this event handler. So check openScope before proceeding.
      if (!openScope) { return; }

      if(evt && openScope.getAutoClose() === 'disabled')  { return; }

      const toggleElement = openScope.getToggleElement();
      if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
        return;
      }

      const $element = openScope.getElement();
      if(evt && openScope.getAutoClose() === 'outsideClick' && $element && $element[0].contains(evt.target)) {
        return;
      }

      openScope.isOpen = false;

      if (!$rootScope.$$phase) {
        openScope.$apply();
      }
    };

    const escapeKeyBind = function (evt) {
      if (evt.which === 27) {
        openScope.focusToggleElement();
        closeDropdown();
      }
    };

    this.open = function (dropdownScope) {
      if (!openScope) {
        $document.bind('click', closeDropdown);
        $document.bind('keydown', escapeKeyBind);
      }

      if (openScope && openScope !== dropdownScope) {
        openScope.isOpen = false;
      }

      openScope = dropdownScope;
    };

    this.close = function (dropdownScope) {
      if (openScope === dropdownScope) {
        openScope = null;
        $document.unbind('click', closeDropdown);
        $document.unbind('keydown', escapeKeyBind);
      }
    };
  }])

  .controller('DropdownController', [
    '$scope',
    '$attrs',
    '$parse',
    'dropdownConfig',
    'dropdownService',
    '$animate',
    '$position',
    '$document', function ($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate, $position, $document) {
      const self = this;
      const scope = $scope.$new(); // create a child scope so we are not polluting original one
      const openClass = dropdownConfig.openClass;
      let getIsOpen;
      let setIsOpen = angular.noop;
      const toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;
      let appendToBody = false;

      this.init = function (element) {
        self.$element = element;

        if ($attrs.isOpen) {
          getIsOpen = $parse($attrs.isOpen);
          setIsOpen = getIsOpen.assign;

          $scope.$watch(getIsOpen, (value) => {
            scope.isOpen = !!value;
          });
        }

        appendToBody = angular.isDefined($attrs.dropdownAppendToBody);

        if (appendToBody && self.dropdownMenu) {
          $document.find('body').append(self.dropdownMenu);
          element.on('$destroy', function handleDestroyEvent() {
            self.dropdownMenu.remove();
          });
        }
      };

      this.toggle = function (open) {
        return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
      };

      // Allow other directives to watch status
      this.isOpen = function () {
        return scope.isOpen;
      };

      scope.getToggleElement = function () {
        return self.toggleElement;
      };

      scope.getAutoClose = function () {
        return $attrs.autoClose || 'always'; //or 'outsideClick' or 'disabled'
      };

      scope.getElement = function () {
        return self.$element;
      };

      scope.focusToggleElement = function () {
        if (self.toggleElement) {
          self.toggleElement[0].focus();
        }
      };

      scope.$watch('isOpen', function (isOpen, wasOpen) {
        if (appendToBody && self.dropdownMenu) {
          const pos = $position.positionElements(self.$element, self.dropdownMenu, 'bottom-left', true);
          const css = {
            top: pos.top + 'px',
            display: isOpen ? 'block' : 'none'
          };

          const rightalign = self.dropdownMenu.hasClass('dropdown-menu-right');
          if (!rightalign) {
            css.left = pos.left + 'px';
            css.right = 'auto';
          } else {
            css.left = 'auto';
            css.right = (window.innerWidth - (pos.left + self.$element.prop('offsetWidth'))) + 'px';
          }

          self.dropdownMenu.css(css);
        }

        $animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);

        if (isOpen) {
          scope.focusToggleElement();
          dropdownService.open(scope);
        } else {
          dropdownService.close(scope);
        }

        setIsOpen($scope, isOpen);
        if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
          toggleInvoker($scope, { open: !!isOpen });
        }
      });

      $scope.$on('$locationChangeSuccess', () => {
        scope.isOpen = false;
      });

      $scope.$on('$destroy', () => {
        scope.$destroy();
      });
    }
  ])

  .directive('dropdown', function () {
    return {
      controller: 'DropdownController',
      link: function (scope, element, attrs, dropdownCtrl) {
        dropdownCtrl.init(element);
      }
    };
  })

  .directive('dropdownMenu', function () {
    return {
      restrict: 'AC',
      require: '?^dropdown',
      link: function (scope, element, attrs, dropdownCtrl) {
        if (!dropdownCtrl) {
          return;
        }
        dropdownCtrl.dropdownMenu = element;
      }
    };
  })

  .directive('dropdownToggle', function () {
    return {
      require: '?^dropdown',
      link: function (scope, element, attrs, dropdownCtrl) {
        if (!dropdownCtrl) {
          return;
        }

        dropdownCtrl.toggleElement = element;

        const toggleDropdown = function (event) {
          event.preventDefault();

          if (!element.hasClass('disabled') && !attrs.disabled) {
            scope.$apply(() => {
              dropdownCtrl.toggle();
            });
          }
        };

        element.bind('click', toggleDropdown);

        // WAI-ARIA
        element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
        scope.$watch(dropdownCtrl.isOpen, (isOpen) => {
          element.attr('aria-expanded', !!isOpen);
        });

        scope.$on('$destroy', () => {
          element.unbind('click', toggleDropdown);
        });
      }
    };
  });
