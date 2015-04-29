'use strict';

/**
 * User Registration controller
 */
angular.module('timetrackerApp.controller.registration', [])
  .controller('RegistrationCtrl', function($scope, UserModel, $alert, $timeout, $location) {

    $scope.userData = {};
    $scope.sendingData = false;

    $scope.testPasswordEqual = function() {
      if ($scope.userData.password === $scope.userData.passwordRepeat) {
        $scope.signup.passwordRepeat.$setValidity('match', true);
      } else {
        $scope.signup.passwordRepeat.$setValidity('match', false);
      }
    };



    /**
     * Process user sign up
     */
    $scope.registerUser = function() {
      $scope.sendingData = true;
      UserModel.registerUser($scope.userData)
        .then(function() {
          $alert({
            title: 'Yeaah!',
            content: 'Registration succeded! You will be redirected ...',
            placement: 'top',
            duration: 5,
            type: 'success',
            show: true
          });
          $timeout(function() {
            $location.path('dashboard');
          }, 5000);
          $scope.sendingData = false;
        }, function(err) {
          $scope.sendingData = false;
          $scope.showError(err);
        });
    };

  });