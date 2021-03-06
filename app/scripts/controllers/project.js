'use strict';
/*global moment*/
/**
 * Project board controller
 */
angular.module('timetrackerApp.controller.project', [])
    .controller('ProjectCtrl', function ($scope, $location, projectService) {

        $scope.visibleProjects = [];
        $scope.selectedProject = {};

        $scope.bookingsList = [];


        $scope.go = function (path) {
            $location.path(path);
        };

        /**
         * Selects a current project
         */
        $scope.selectProject = function (project) {
            $scope.selectedProject = project;
            $scope.bookingsList = [];

            projectService.getUserProjectBookings(project, function (bookingList) {
                $scope.bookingsList = bookingList;
            });
        };


        /**
         * Init Controller
         */
        $scope.init = function () {
            /**
             * Load visible projects by page load
             * */
            projectService.getUserProjects(function (data) {
                if (data.records) {
                    $scope.visibleProjects = data.records;
                    $scope.selectProject(data.records[0]);
                }
            });
        };

        $scope.isProjectActive = function (project) {
            if (!project) {
                return false;
            }
            return (moment().isAfter(project.projectStart) && moment().isBefore(project.projectEnd)) ? true : false;
        };

        $scope.init();
    });