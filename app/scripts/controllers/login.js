'use strict';

/**
 * Authentication Controller
 */
angular.module('timetrackerApp.controller.login', [])
  .controller('LoginCtrl', function($rootScope, $log, $location, $http, $scope, $timeout, UserModel) {

    $scope.loginData = {};
    $scope.error = null;
    $scope.success = null;

    $scope.resetView = function() {
      $scope.error = null;
      $scope.success = null;
    };


    $scope.authenticate = function() {
      UserModel.loginUser($scope.loginData, function(err) {
        if (!err) {
          $scope.success = 'Success';
          $timeout(function() {
            $location.path('dashboard');
          }, 100, true);

        } else {
          if (err === 401) {
            $scope.error = 'Username or password are wrong.';
          }
          if (err === 404) {
            $scope.error = 'Server does not react.Try again later.';
          } else {
            $scope.error = 'Cannot authenticate. Try again later.';
          }
        }
      });
    };

  });