'use strict';

/**
 * Authentication Controller
 */
angular.module('timetrackerApp.controller.navbar', [])
  .controller('NavBarCtrl', function($scope, $location, UserModel) {

    $scope.userModel = UserModel;

    $scope.selectedNav = $location.path();

    /**
     * Sets current location of user
     * */
    $scope.setCurrentLocation = function(locationName) {
      $location.path(locationName);
      $scope.selectedNav = $location.path();
    };

    $scope.logout = function() {
      UserModel.logout(function() {
        $location.path('login');
      });
    };
  });