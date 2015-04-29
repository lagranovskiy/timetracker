'use strict';

/**
 * Controller for User dashboard
 *
 */
angular.module('timetrackerApp.controller.dashboard', [])
    .controller('DashboardCtrl', function ($scope, $q, statService, projectService) {

        $scope.statData = {};
        $scope.collegesData = [];

        $scope.projects = [];
        $scope.bookingData = [];

        $scope.init = function () {
            $q.all([

                $scope.refreshProjects(),

                $scope.refreshUserStat(),

                $scope.refreshUserColleges()

            ])
        };

        $scope.calculateBookedTime = function () {
            if (!$scope.statData || !$scope.statData.hoursDay || !$scope.statData.hoursDay.data[0]) {
                return 0;
            }
            var time = _.reduce($scope.statData.hoursDay.data[0], function (memo, num) {
                return memo + num;
            }, 0);

            return time;
        };

        $scope.getTimeTillBirthday = function (birthday) {
            var mom = moment(birthday).year(new Date().getFullYear());
            if (mom.isBefore(new Date())) {
                mom = mom.add(1, 'years');
            }

            var duration = moment.duration(mom.valueOf() - new Date().getTime());
            return duration.humanize();
        };

        /**
         * Refreshes bookings of the current user
         * */
        $scope.refreshProjects = function () {
            return projectService.getUserProjects(function (data) {
                if (data.records) {
                    $scope.projects = data.records;
                }
            });
        };

        $scope.isProjectActive = function (project) {
            if (!project) {
                return false;
            }
            return (moment().isAfter(project.projectStart) && moment().isBefore(project.projectEnd)) ? true : false;
        };


        /**
         * Refreshes statistics
         *
         * @returns {*|type}
         */
        $scope.refreshUserStat = function () {
            /* * {
             *  hoursDay : {
             *      labels: ['3.3.2000',....],
             *      data: [[13,50,11...]]
             *  },
             *  hoursProject : {
             *      labels: ['P1',....],
             *      data: [13,50,11...]
             *  },
             *  hoursEmployee : {
             *      labels: ['Leonid Agranovskiy',....],
             *      data: [13,50,11...]
             *  }
             *
             * }*/
            return statService.getUserBookingStat(
                function (data) {
                    $scope.statData = data;
                })
        }


        /**
         * Refreshes colleges
         *
         * @returns {*|type}
         */
        $scope.refreshUserColleges = function () {
            return statService.getUserColleges(
                function (data) {
                    $scope.collegesData = data;
                })
        }

        $scope.init();
    });
