'use strict';

/**
 * Authentication Controller
 */
angular.module('timetrackerApp.controller.login', [])
  .controller('LoginCtrl', function($rootScope, $log, $location, $http, $scope) {

    $scope.loginData = {};
    $scope.error = null;

    $scope.authenticate = function() {
      $http.post($rootScope.config.server + '/auth/login', $scope.loginData)
        .success(function(data) {
          $scope.error = null;
          $log.info('User authenticated.');
          $location.path('dashboard');
          // this callback will be called asynchronously
          // when the response is available
        })
        .error(function(data, status) {
          if (status === 401) {
            $scope.error = 'Username or password are wrong.';
          }
          if (status === 404) {
            $scope.error = 'Server does not react.Try again later.';
          } else {
            $scope.error = 'Cannot authenticate. Try again later.';
          }
          $log.info('Cannot authenticate user');
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    };

  });