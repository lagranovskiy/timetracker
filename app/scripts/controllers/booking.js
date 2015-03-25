'use strict';

/**
 * Controller for Booking overview and control panel
 *
 */
angular.module('timetrackerApp.controller.booking', [])
  .controller('BookingCtrl', function($scope, bookingsService, projectService, BookingModel, $log) {


    $scope.bookingsList = [];

    $scope.currentBooking = null;

    $scope.visibleProjects = [];

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
        $scope.currentBooking = null;
      });

    };

    /**
     * Sets given booking as a current one
     * */
    $scope.selectBooking = function(booking) {
      $scope.currentBooking = booking;
    };

    /**
     * Create a new project booking
     * */
    $scope.updateBooking = function(booking) {
      if (!booking || !booking.id) {
        $log.debug('Cannot update non persistent booking');
        return;
      }
      BookingModel.resource.update($scope.currentBooking).$promise.then(function() {
        $scope.currentBooking = null;
      });

    };

    /**
     * Removes a new given booking
     * */
    $scope.deleteBooking = function(booking) {
      BookingModel.resource.delete({}, booking).$promise.then(function() {
        bookingsService.getMyBookings(function(bookings) {
          $scope.bookingsList = bookings;
        });
      });

    };

    /**
     * Load bookings initially
     * */
    bookingsService.getMyBookings(function(bookings) {
      $scope.bookingsList = bookings;
    });

    /**
     * Load visible projects by page load
     * */
    projectService.getVisibleProjects(function(data) {
      if (data.records) {
        $scope.visibleProjects = data.records;
      }
    });
  });