/* global angular */

angular.module('timetrackerApp.model.booking', ['ngResource'])
  .factory('BookingModel',
    function($rootScope, $resource) {
      'use strict';

      var bookingResource = $resource($rootScope.config.server + '/booking/:bookingId', {
        bookingId: '@id'
      });

      var bookingModel = {

        resource: bookingResource,

        /**
         * Creates a empty new booking instance that can be persisted later
         */
        produceNewBooking: function() {
          return {
            id: null,
            projectId: null,
            workDay: new Date(),
            workStarted: new Date(1970, 0, 1, 13, 0, 0),
            workFinished: new Date(1970, 0, 1, 14, 0, 0),
            pause: 30,
            comment: '',
            createdTime: new Date(),
            lastUpdatedTime: new Date()
          };
        }

      };

      return bookingModel;
    });