'use strict';

angular.module('timetrackerApp.directives.username', [])
  .directive('username', function($rootScope, $timeout, $q, $http) {
    return {
      require: 'ngModel',
      link: function(scope, elm, attr, model) {
        model.$asyncValidators.username = function(modelValue, viewValue) {

          var value = modelValue || viewValue;

          // Lookup user by username
          return $http.get($rootScope.config.server + '/user/check/' + value)
            .then(function resolved(response) {
              if (response.data.userExist) {
                return $q.reject('User exist');
              }
              return true;
            }, function rejected() {
              console.error('Cannot evaluate user exists');
              return true;
            });

        };
      }
    };
  });