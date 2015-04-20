'use strict';

/*global _*/

/**
 * Controller for Booking overview and control panel
 *
 */
angular.module('timetrackerApp.controller.booking', [])
    .controller('BookingCtrl', function ($scope, $routeParams, socket, projectService, BookingModel, $log, $q, $aside, UserModel) {


        $scope.bookingsList = [];

        $scope.currentBooking = null;

        $scope.visibleProjects = [];

        socket.forward('booking', $scope);
        $scope.$on('socket:booking', function (ev, data) {
            if (UserModel.data.id === data.message.userId) {
                $scope.refreshBookings();
            }
        });

        socket.forward('assignment', $scope);
        $scope.$on('socket:assignment', function (ev, data) {
            if (UserModel.data.personId === data.message.personId) {
                $scope.refreshVisibleProjects();
            }
        });

        /**
         * Sets given booking as a current one
         * */
        $scope.selectBooking = function (booking) {
            $scope.currentBooking = booking;
        };

        /**
         * Find a project by id
         * */
        $scope.findProjectNameById = function (projectId) {
            if (!projectId || $scope.visibleProjects.length === 0) {
                return '';
            }

            var foundProject = _.findWhere($scope.visibleProjects, {
                id: projectId
            });

            if (!foundProject) {
                return '.. removed ..';
            }

            return foundProject.projectName;
        };

        /**
         * Creates a new booking only if no booking is creating now
         * */
        $scope.createNewBooking = function () {
            $scope.currentBooking = BookingModel.produceNewBooking();
        };

        /**
         * Creates a new booking only if no booking is creating now
         * */
        $scope.resetBooking = function () {
            $scope.currentBooking = null;
        };

        /**
         * Create a new project booking
         * */
        $scope.createBooking = function () {
            if (!$scope.currentBooking) {
                $log.debug('Cannot create null booking');
                return;
            }
            BookingModel.saveBooking($scope.currentBooking)
                .then(function () {
                    return $scope.refreshBookings();
                }, $scope.showError)

                .then(function () {
                    $scope.currentBooking = null;
                }, $scope.showError);

        };


        /**
         * Create a new project booking
         * */
        $scope.updateBooking = function () {
            if (!$scope.currentBooking || !$scope.currentBooking.id) {
                $log.debug('Cannot update non persistent booking');
                return;
            }
            BookingModel.updateBooking($scope.currentBooking)
                .then(function () {
                    return $scope.refreshBookings();
                }, $scope.showError)
                .then(function () {
                    $scope.currentBooking = null;
                }, $scope.showError);
        };


        /**
         * Removes a new given booking
         * */
        $scope.deleteBooking = function (booking) {
            BookingModel.deleteBooking(booking)
                .then(function () {
                    return $scope.refreshBookings();
                }, $scope.showError)
                .then(function () {
                    $scope.currentBooking = null;
                }, $scope.showError);
        };

        $scope.refreshVisibleProjects = function () {
            return projectService.getUserProjects(function (data) {
                if (data.records) {
                    $scope.visibleProjects = data.records;
                }
            });
        }

        /**
         * Initializes the booking page with start data
         */
        $scope.initPage = function () {

            $q.all([

            /**
             * Load visible projects of user
             */
                $scope.refreshVisibleProjects(),

            /**
             * Load user bookings
             */
                $scope.refreshBookings()

            ]).then(function () {
                /**
                 * Load visible projects by page load
                 * */
                if ($routeParams.projectId) {
                    $scope.createNewBooking();
                    $scope.currentBooking.projectId = $routeParams.projectId * 1;
                    $aside({scope: $scope, template: 'modal/CreateBooking.tpl.html'});

                }
            }, $scope.showError);

        };

        /**
         * Refreshes bookings of the current user
         * */
        $scope.refreshBookings = function () {
            /**
             * Load bookings initially
             * */
            var retVal = BookingModel.getMyBookings(function (bookings) {
                $scope.bookingsList = bookings;
            });
            return retVal;

        };


    });
