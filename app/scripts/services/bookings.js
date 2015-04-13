'use strict';

angular.module('timetrackerApp.service.bookings', ['ngCookies'])

  .factory('bookingsService', ['$rootScope', '$location', '$http', '$log',
    function ($rootScope, $location, $http, $log) {

      return {
        getMyBookings: function (callback) {
          var retVal = $http.get($rootScope.config.server + '/user/bookings')
            .success(function (data) {
              $log.info('Bookings of currect user loaded.');
              if (callback) {
                callback(data);
              }
            })
            .error(function (data, status) {
              $log.info('Cannot get user bookings.' + status + ' / ' + data);
            });

          return retVal;
        },

        /**
         * Return bookings of given user
         *
         * @param userId
         * @param callback
         */
        getUserBookings: function (userId, callback) {
          var retVal = $http.get($rootScope.config.server + '/admin/user/' + userId + '/bookings')
            .success(function (data) {
              $log.info('Bookings of user '+ userId + 'loaded.');
              if (callback) {
                callback(data);
              }
            })
            .error(function (data, status) {
              $log.info('Cannot get user bookings '+ userId + '.' + status + ' / ' + data);
            });

          return retVal;
        }

      };
    }
  ]);
