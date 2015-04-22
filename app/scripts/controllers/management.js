'use strict';
/* global moment*/
/* global _*/
/**
 * Project board controller
 */
angular.module('timetrackerApp.controller.management', [])
    .controller('ManagementCtrl', function ($scope, $q, $log, $location, ProjectModel, PersonModel, BookingModel, socket) {

        $scope.currentMode = 'cockpit';

        /*** Booking Cockpit ***/
        $scope.bookingList = [];


        /*** Project cockpit */
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
         * Calculation of data rows
         *
         * http://jtblin.github.io/angular-chart.js/
         */
        $scope.calculateDataRows = function () {

            var workTimeMap = {};
            var projectWorkTimeMap = {};
            var employeeMap = {};
            var bookingList = $scope.bookingList;

            var minDay = new Date().getTime();
            var maxDay = new Date().getTime();

            _.each(bookingList, function (booking) {
                if (booking.workDay < minDay) {
                    minDay = booking.workDay;
                }
                if (booking.workDay > maxDay) {
                    maxDay = booking.workDay;
                }

                var workTime = moment.duration(booking.workFinished - booking.workStarted).subtract(booking.pause, 'minutes').hours();
                var date = moment(booking.workDay).format('l');
                if (!workTimeMap[date]) {
                    workTimeMap[date] = 0;
                }
                workTimeMap[date] = workTimeMap[date] + workTime;

                var projectName = $scope.findProjectNameById(booking.projectId);
                if (!projectWorkTimeMap[projectName]) {
                    projectWorkTimeMap[projectName] = 0;
                }
                projectWorkTimeMap[projectName] = projectWorkTimeMap[projectName] + workTime;


                var employee = $scope.personMap[booking.personId];
                var fullname = employee.forename + ' ' + employee.surname;

                if (!employeeMap[fullname]) {
                    employeeMap[fullname] = 0;
                }
                employeeMap[fullname] = employeeMap[fullname] + workTime;
            });

            $scope.workTimeMapLabels = _.keys(workTimeMap);
            var workTimeMapValues = [];
            _.each($scope.workTimeMapLabels, function (label) {
                workTimeMapValues.push(workTimeMap[label]);
            });
            $scope.workTimeMapData = [workTimeMapValues];

            $scope.projecWorkTimeMapLabels = _.keys(projectWorkTimeMap);
            var projectMapValues = [];
            _.each($scope.projecWorkTimeMapLabels, function (label) {
                projectMapValues.push(projectWorkTimeMap[label]);
            });
            $scope.projecWorkTimeMapData = projectMapValues;

            $scope.employeeMapLabels = _.keys(employeeMap);
            var employeeMapValues = [];
            _.each($scope.employeeMapLabels, function (label) {
                employeeMapValues.push(employeeMap[label]);
            });
            $scope.employeeMapData = employeeMapValues;


        }


        $scope.workTimeMapLabels = [];
        $scope.workTimeMapSeries = ['Work time'];
        $scope.workTimeMapData = [];

        $scope.projecWorkTimeMapLabels = [];
        $scope.projecWorkTimeMapData = [];

        $scope.employeeMapLabels = [];
        $scope.employeeMapData = [];

        /**
         * UI Mode support
         */

        $scope.selectMode = function (mode) {
            $scope.currentMode = mode;
        }


        /**
         * Socket support
         * */
        socket.forward('booking', $scope);
        $scope.$on('socket:booking', function (ev, data) {
            if ($scope.currentMode === 'project' && $scope.selectedProject && $scope.selectedProject.id === data.message.projectId) {
                $scope.selectProject($scope.selectedProject)
            }

            if ($scope.currentMode === 'cockpit') {
                $scope.refreshBookings()
                    .then($scope.calculateDataRows);
            }
        });

        socket.forward('assignment', $scope);
        $scope.$on('socket:assignment', function (ev, data) {
            if ($scope.currentMode === 'project' && $scope.selectedProject && $scope.selectedProject.id === data.message.projectId) {
                $scope.selectProject($scope.selectedProject)
            }
        });

        $scope.findProjectNameById = function (projectId) {
            var foundProject = null;
            _.each($scope.projects, function (project) {
                if (project.id === projectId) {
                    foundProject = project;
                }
            });
            if (!foundProject) {
                return 'Unknown';
            }
            return foundProject.projectName;
        }


        /**
         * Creates a pending assignments for every person/role combination
         */
        $scope.createPendingAssignments = function () {
            _.each($scope.unassignedResources.person, function (person) {
                var assignment = {
                    person: person,
                    role: $scope.unassignedResources.role,
                    project: $scope.selectedProject
                };

                var alreadyPending = false;
                _.each($scope.pendingAssignments, function (pendingAssignment) {
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
        $scope.commitPendingAssignments = function () {
            ProjectModel.commitProjectAssignments($scope.pendingAssignments).then(function () {
                // Reload all resources and statistics
                $scope.selectProject($scope.selectedProject);

                // Remove assigments from pending list
                $scope.pendingAssignments = [];

            }, $scope.showError);
        };


        /**
         * Removes pending assignment
         */
        $scope.removePendingAssignment = function (assignment) {
            $scope.pendingAssignments = _.without($scope.pendingAssignments, assignment);
        };

        /**
         * Removes commited assignment
         */
        $scope.removeCommitedAssignment = function (assignment) {
            ProjectModel.removeCommitedAssignments(assignment.assignmentId).then(function () {
                // Reload all resources and statistics
                $scope.selectProject($scope.selectedProject);
            }, $scope.showError);
        };


        /**
         * Create a new project booking
         * */
        $scope.createProject = function () {
            if (!$scope.currentProject) {
                $log.debug('Cannot create null project');
                return;
            }
            ProjectModel.resource.save($scope.currentProject)
                .$promise
                .then(function () {
                    return $scope.refreshProjects();
                }, $scope.showError)

                .then(function () {
                    $scope.currentProject = null;
                }, $scope.showError);

        };


        /**
         * Create a new project booking
         * */
        $scope.updateProject = function () {
            if (!$scope.currentProject || !$scope.currentProject.id) {
                $log.debug('Cannot update non persistent project');
                return;
            }
            ProjectModel.resource.update($scope.currentProject).$promise
                .then(function () {
                    return $scope.refreshProjects();
                }, $scope.showError);

        };


        /**
         * Create a new project booking
         * */
        $scope.deleteProject = function () {
            if (!$scope.currentProject || !$scope.currentProject.id) {
                $log.debug('Cannot delete non persistent project');
                return;
            }
            ProjectModel.resource.delete({
                id: $scope.currentProject.id
            }).$promise
                .then(function () {
                    return $scope.refreshProjects();
                }, $scope.showError);

        };


        /**
         * Creates instance for a new project
         */
        $scope.produceNewProject = function () {
            $scope.currentProject = ProjectModel.produceNewProject();
        };


        $scope.go = function (path) {
            $location.path(path);
        };

        $scope.isProjectActive = function (project) {
            if (!project) {
                return false;
            }
            return (moment().isAfter(project.projectStart) && moment().isBefore(project.projectEnd)) ? true : false;
        };

        /**
         * Returns the time in hours how much time booked on project
         */
        $scope.getTimeBooked = function () {
            if (!$scope.projectStatistics) {
                return null;
            }
            return moment.duration($scope.projectStatistics.bookedTime).asHours() - moment.duration($scope.projectStatistics.bookedPause, 'minutes').asHours();
        };


        /**
         * Selects a current project
         */
        $scope.selectProject = function (project) {
            $scope.selectedProject = project;
            $scope.currentProject = project;
            $scope.bookingsList = [];
            if (project) {

                // Get project statistics
                var pS = ProjectModel.getProjectStatistics(project).then(
                    function (statistics) {
                        $scope.projectStatistics = statistics.data;
                    }, $scope.showError);

                // Get project resources
                var pR = ProjectModel.getProjectResources(project).then(
                    function (resources) {
                        $scope.projectResources = resources.data;
                    }, $scope.showError);

                // Get project bookings
                var pB = ProjectModel.getProjectBookings(project).then(
                    function (bookings) {
                        $scope.projectBookings = bookings.data;
                    }, $scope.showError);


                return $q.all([pS, pR, pB]);
            }
        };


        /**
         * Initializes the booking page with start data
         */
        $scope.initProjectMode = function () {

            $q.all([

                $scope.refreshProjects(),

            /**
             * Load persons bookings
             */
                PersonModel.resource.query(function (data) {
                    $scope.personMap = _.indexBy(data, 'id');
                    $scope.personList = data;
                }),

            /**
             * Load roles
             */
                PersonModel.roleResource.query(function (data) {
                    $scope.rolesList = data;
                })


            ]);

        };


        /**
         * Initializes the booking page with start data
         */
        $scope.initBookingMode = function () {

            $q.all([

                PersonModel.resource.query(function (data) {
                    $scope.personMap = _.indexBy(data, 'id');
                    $scope.personList = data;
                }).$promise,

                $scope.refreshProjects(),

                $scope.refreshBookings()

            ]).then($scope.calculateDataRows);


        };

        /**
         * Refreshes bookings
         * @returns {*}
         */
        $scope.refreshBookings = function () {
            var promise = BookingModel.listBookings(function (bookingList) {
                $scope.bookingList = bookingList;
            })

            return promise;
        }

        /**
         * Refreshes bookings of the current user
         * */
        $scope.refreshProjects = function () {
            return ProjectModel.resource.query(function (data) {
                if (data) {
                    $scope.projects = data;
                    $scope.selectProject(data[0]);
                }
            });
        };


    });
