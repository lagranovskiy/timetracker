'use strict';

/*global _*/

/**
 * Controller for Booking overview and control panel
 *
 */
angular.module('timetrackerApp.controller.booking', [])
  .controller('BookingCtrl', function($scope, bookingsService, projectService, BookingModel, $log, $alert, $modal) {


    $scope.bookingsList = [];

    $scope.currentBooking = null;

    $scope.visibleProjects = [];


    /**
     * Sets given booking as a current one
     * */
    $scope.selectBooking = function(booking) {
      $scope.currentBooking = booking;
    };

    /**
     * Find a project by id
     * */
    $scope.findProjectNameById = function(projectId) {
      if (!projectId || $scope.visibleProjects.length === 0) {
        return '';
      }

      var foundProject = _.findWhere($scope.visibleProjects, {
        id: projectId
      });

      return foundProject.projectName;
    };

    /**
     * Creates a new booking only if no booking is creating now
     * */
    $scope.createNewBooking = function() {
      $scope.currentBooking = BookingModel.produceNewBooking();
    };

    /**
     * Creates a new booking only if no booking is creating now
     * */
    $scope.resetBooking = function() {
      $scope.currentBooking = null;
    };

    /**
     * Create a new project booking
     * */
    $scope.createBooking = function() {
      if (!$scope.currentBooking) {
        $log.debug('Cannot create null booking');
        return;
      }
      BookingModel.resource.save($scope.currentBooking).$promise.then(function() {
        return $scope.refreshBookings();
      }).then(function() {
        $scope.currentBooking = null;
      }, function(err) {
        $alert({
          title: 'Ooops!',
          content: err,
          placement: 'top',
          type: 'info',
          show: true
        });
      });

    };



    /**
     * Create a new project booking
     * */
    $scope.updateBooking = function() {
      if (!$scope.currentBooking || !$scope.currentBooking.id) {
        $log.debug('Cannot update non persistent booking');
        return;
      }
      BookingModel.resource.update($scope.currentBooking).$promise.then(function() {
        return $scope.refreshBookings();
      }).then(function() {
        $scope.currentBooking = null;
      }, function(err) {
        $alert({
          title: 'Ooops!',
          content: err,
          placement: 'top',
          type: 'info',
          show: true
        });
      });
    };


    /**
     * Removes a new given booking
     * */
    $scope.deleteBooking = function(booking) {
      BookingModel.resource.delete({
        bookingId: booking.id
      }).$promise.then(function() {
        return $scope.refreshBookings();
      }, function(err) {
        $alert({
          title: 'Ooops!',
          content: err,
          placement: 'top',
          type: 'info',
          show: true
        });
      }).then(function() {
        $scope.currentBooking = null;
      }, function(err) {
        $alert({
          title: 'Ooops!',
          content: err,
          placement: 'top',
          type: 'info',
          show: true
        });
      });
    };


    /**
     * Refreshes bookings of the current user
     * */
    $scope.refreshBookings = function() {
      /**
       * Load bookings initially
       * */
      var retVal = bookingsService.getMyBookings(function(bookings) {
        $scope.bookingsList = bookings;
      });
      return retVal;

    };


    /**
     * Load visible projects by page load
     * */
    projectService.getVisibleProjects(function(data) {
      if (data.records) {
        $scope.visibleProjects = data.records;
      }
    });
  });