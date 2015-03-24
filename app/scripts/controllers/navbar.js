'use strict';

/**
 * Authentication Controller
 */
angular.module('timetrackerApp.controller.navbar', [])
  .controller('NavBarCtrl', function($scope, $location, UserModel) {

    $scope.userModel = UserModel;

    $scope.logout = function() {
      UserModel.logout(function() {
        $location.path('login');
      });
    };
  });