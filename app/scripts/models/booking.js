/* global angular */

angular.module('timetrackerApp.model.booking', ['ngResource'])
    .factory('BookingModel',
    function ($rootScope, $resource, bookingsService) {
        'use strict';

        var bookingResource = $resource($rootScope.config.server + '/booking/:bookingId', {
            bookingId: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });

        var bookingModel = {

            resource: bookingResource,

            /**
             * Return bookings of current user
             *
             * @param userId
             * @param callback
             */
            getMyBookings: function (callback) {
                var retVal = bookingsService.getMyBookings(function (data) {
                    if (callback) {
                        callback(data);
                    }
                });
                return retVal;
            },

            /**
             * Return bookings of given user
             * Attention: Only for admins!
             * @param userId
             * @param callback
             */
            getUserBookings: function (userId, callback) {
                var retVal = bookingsService.getUserBookings(userId, function (data) {
                    if (callback) {
                        callback(data);
                    }
                });
                return retVal;
            },


            /**
             * Resolves a list with all bookings
             *
             * @param callback
             * @returns {*}
             */
            listBookings: function (limit, start, callback) {
                var retVal = bookingsService.getAllBookings(limit, start, function (data) {
                    if (callback) {
                        callback(data);
                    }
                });
                return retVal;
            },


            /**
             * Deletes given booging
             * @param booking
             * @param callback
             * @returns {*}
             */
            deleteBooking: function (booking, callback) {
                var retVal = bookingModel.resource.delete(
                    {
                        bookingId: booking.id
                    }, function (data) {
                        if (callback) {
                            callback(data);
                        }
                    });
                return retVal.$promise;
            },

            /**
             * Updates given booging
             * @param booking
             * @param callback
             * @returns {*}
             */
            updateBooking: function (booking, callback) {
                var retVal = bookingModel.resource.update(booking, function (data) {
                    if (callback) {
                        callback(data);
                    }
                });
                return retVal.$promise;
            },

            /**
             * Saves given booging
             * @param booking
             * @param callback
             * @returns {*}
             */
            saveBooking: function (booking, callback) {
                var retVal = bookingModel.resource.save(booking, function (data) {
                    if (callback) {
                        callback(data);
                    }
                });
                return retVal.$promise;
            },


            /**
             * Creates a empty new booking instance that can be persisted later
             */
            produceNewBooking: function () {
                return {
                    id: null,
                    projectId: null,
                    workDay: new Date().setHours(0, 0, 0, 0),
                    workStarted: new Date(1970, 0, 1, 13, 0, 0).getTime(),
                    workFinished: new Date(1970, 0, 1, 14, 0, 0).getTime(),
                    pause: 30,
                    comment: '',
                    createdTime: new Date().getTime(),
                    lastUpdatedTime: new Date().getTime()
                };
            }

        };

        return bookingModel;
    });
