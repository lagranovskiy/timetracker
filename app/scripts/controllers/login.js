'use strict';

/**
 * Authentication Controller
 */
angular.module('timetrackerApp.controller.login', [])
  .controller('LoginCtrl', function($scope, $log, $location, $timeout, UserModel) {

    $scope.loginData = {};
    $scope.error = null;
    $scope.success = null;


    /**
     * Reset view to initial state
     */
    $scope.resetView = function() {
      $scope.error = null;
      $scope.success = null;
    };

    /**
     * go to user registration
     * */
    $scope.goToSignUp = function() {
      $location.path('signup');
    };


    /**
     * Authenticate user
     */
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