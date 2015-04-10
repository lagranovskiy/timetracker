'use strict';

/**
 * Project board controller
 */
angular.module('timetrackerApp.controller.admin', [])
  .controller('AdminCtrl', function($scope, $q,PersonModel) {

      $scope.personList = [];

      /**
       * Initializes the booking page with start data
       */
      $scope.init = function() {

        $q.all([

        /**
         * Load person list
         */
          PersonModel.resource.query(function(data) {
            $scope.personList = data;
          }),




        ]);

      };



    });