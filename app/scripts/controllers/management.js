'use strict';
/* global moment*/
/* global _*/
/**
 * Project board controller
 */
angular.module('timetrackerApp.controller.management', [])
  .controller('ManagementCtrl', function($scope, $q, $log, $location, ProjectModel, PersonModel) {

    $scope.projects = [];
    $scope.selectedProject = {}; // Project that selected in the list
    $scope.currentProject = null; // Project for creation / update

    $scope.personMap = {};


    $scope.projectStatistics = null;
    $scope.projectResources = null;
    $scope.projectBookings = null;

    /* Assignment of persons*/
    $scope.personList = [];
    $scope.rolesList = [];

    $scope.unassignedResources = {
      person: [],
      role: null
    };

    $scope.pendingAssignments = [];


    /**
     * Creates a pending assignments for every person/role combination
     */
    $scope.createPendingAssignments = function() {
      _.each($scope.unassignedResources.person, function(person) {
        var assignment = {
          person: person,
          role: $scope.unassignedResources.role,
          project: $scope.selectedProject
        };

        var alreadyPending = false;
        _.each($scope.pendingAssignments, function(pendingAssignment) {
          if (pendingAssignment.person.id === assignment.person.id && pendingAssignment.role === assignment.role) {
            alreadyPending = true;
          }
        });

        if (!alreadyPending) {
          $scope.pendingAssignments.push(assignment);
        }

      });
      $scope.unassignedResources.person = [];
      $scope.unassignedResources.role = null;
    };

    /**
     * Commits pending assignment to the server
     * */
    $scope.commitPendingAssignments = function() {
      ProjectModel.commitProjectAssignments($scope.pendingAssignments).then(function() {
        // Reload all resources and statistics
        $scope.selectProject($scope.selectedProject);

        // Remove assigments from pending list
        $scope.pendingAssignments = [];

      }, $scope.showError);
    };


    /**
     * Removes pending assignment
     */
    $scope.removePendingAssignment = function(assignment) {
      $scope.pendingAssignments = _.without($scope.pendingAssignments, assignment);
    };

    /**
     * Removes commited assignment
     */
    $scope.removeCommitedAssignment = function(assignment) {
      ProjectModel.removeCommitedAssignments(assignment.assignmentId).then(function() {
        // Reload all resources and statistics
        $scope.selectProject($scope.selectedProject);
      }, $scope.showError);
    };


    /**
     * Create a new project booking
     * */
    $scope.createProject = function() {
      if (!$scope.currentProject) {
        $log.debug('Cannot create null project');
        return;
      }
      ProjectModel.resource.save($scope.currentProject).$promise

        .then(function() {
        return $scope.refreshProjects();
      }, $scope.showError)

      .then(function() {
        $scope.currentProject = null;
      }, $scope.showError);

    };



    /**
     * Create a new project booking
     * */
    $scope.updateProject = function() {
      if (!$scope.currentProject || !$scope.currentProject.id) {
        $log.debug('Cannot update non persistent project');
        return;
      }
      ProjectModel.resource.update($scope.currentProject).$promise
        .then(function() {
          return $scope.refreshProjects();
        }, $scope.showError);

    };


    /**
     * Create a new project booking
     * */
    $scope.deleteProject = function() {
      if (!$scope.currentProject || !$scope.currentProject.id) {
        $log.debug('Cannot delete non persistent project');
        return;
      }
      ProjectModel.resource.delete({
          id: $scope.currentProject.id
        }).$promise
        .then(function() {
          return $scope.refreshProjects();
        }, $scope.showError);

    };




    /**
     * Creates instance for a new project
     */
    $scope.produceNewProject = function() {
      $scope.currentProject = ProjectModel.produceNewProject();
    };


    $scope.go = function(path) {
      $location.path(path);
    };

    $scope.isProjectActive = function(project) {
      if (!project) {
        return false;
      }
      return (moment().isAfter(project.projectStart) && moment().isBefore(project.projectEnd)) ? true : false;
    };

    /**
     * Returns the time in hours how much time booked on project
     */
    $scope.getTimeBooked = function() {
      if (!$scope.projectStatistics) {
        return null;
      }
      return moment.duration($scope.projectStatistics.bookedTime).asHours() - moment.duration($scope.projectStatistics.bookedPause, 'minutes').asHours();
    };


    /**
     * Selects a current project
     */
    $scope.selectProject = function(project) {
      $scope.selectedProject = project;
      $scope.currentProject = project;
      $scope.bookingsList = [];
      if (project) {

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
      }
    };




    /**
     * Initializes the booking page with start data
     */
    $scope.init = function() {

      $q.all([

        $scope.refreshProjects(),

        /**
         * Load user bookings
         */
        PersonModel.resource.query(function(data) {
          $scope.personMap = _.indexBy(data, 'id');
          $scope.personList = data;
        }),

        /**
         * Load user bookings
         */
        PersonModel.roleResource.query(function(data) {
          $scope.rolesList = data;
        })


      ]);

    };

    /**
     * Refreshes bookings of the current user
     * */
    $scope.refreshProjects = function() {
      return ProjectModel.resource.query(function(data) {
        if (data) {
          $scope.projects = data;
          $scope.selectProject(data[0]);
        }
      });
    };



  });