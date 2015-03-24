/* global angular */

angular.module('timetrackerApp.model.booking', ['ngResource'])
  .factory('BookingModel',
    function($rootScope, $resource) {
      'use strict';

      var bookingResource = $resource($rootScope.config.server + '/booking/:bookingId', {});

      return bookingResource;
    });