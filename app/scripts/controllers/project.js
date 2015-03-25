'use strict';

/**
 * Project board controller
 */
angular.module('timetrackerApp.controller.project', [])
  .controller('ProjectCtrl', function($scope, projectService, ProjectModel) {

    $scope.visibleProjects = [];
    $scope.selectedProject = {};


    $scope.selectProject = function(project) {
      $scope.selectedProject = project;
    };

    /**
     * Load visible projects by page load
     * */
    projectService.getVisibleProjects(function(data) {
      if (data.records) {
        $scope.visibleProjects = data.records;
        $scope.selectedProject = data.records[0];
      }
    });

  });