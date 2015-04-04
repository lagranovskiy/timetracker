'use strict';
/* global moment*/
/* global _*/
/**
 * Project board controller
 */
angular.module('timetrackerApp.controller.management', [])
  .controller('ManagementCtrl', function($scope, $q, $location, ProjectModel, PersonModel) {

    $scope.projects = [];
    $scope.selectedProject = {};

    $scope.personMap = {};


    $scope.projectStatistics = null;
    $scope.projectResources = null;
    $scope.projectBookings = null;

    $scope.go = function(path) {
      $location.path(path);
    };

    /**
     * Returns the time in hours how much time booked on project
     */
    $scope.getTimeBooked = function() {
      return moment.duration($scope.projectStatistics.bookedTime).asHours() - moment.duration($scope.projectStatistics.bookedPause, 'minutes').asHours();
    };


    /**
     * Selects a current project
     */
    $scope.selectProject = function(project) {
      $scope.selectedProject = project;
      $scope.bookingsList = [];

      // Get project statistics
      var pS = ProjectModel.getProjectStatistics(project).then(
        function(statistics) {
          $scope.projectStatistics = statistics.data;
        }, $scope.showError);

      // Get project resources
      var pR = ProjectModel.getProjectResources(project).then(
        function(resources) {
          $scope.projectResources = resources.data;
        }, $scope.showError);

      // Get project bookings
      var pB = ProjectModel.getProjectBookings(project).then(
        function(bookings) {
          $scope.projectBookings = bookings.data;
        }, $scope.showError);


      return $q.all([pS, pR, pB]);
    };


    /**
     * Init Controller
     */
    $scope.init = function() {
      /**
       * Load visible projects by page load
       * */
      ProjectModel.resource.query(function(data) {
        if (data) {
          $scope.projects = data;
          $scope.selectProject(data[0]);
        }
      });

      PersonModel.resource.query(function(data) {
        $scope.personMap = _.indexBy(data, 'id');
      });
    };



  });