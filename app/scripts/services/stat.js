'use strict';

angular.module('timetrackerApp.service.stat', [])

/**
 * Stat Service handels mixed functionality for statistics
 */
    .factory('statService', ['$rootScope', '$location', '$http', '$log',
        function ($rootScope, $location, $http, $log) {
            return {
                /**
                 * getProjectStatistic - Resolves project statistics
                 *
                 * @param  {type} project  description
                 * @param  {type} callback description
                 * @return {type}          description
                 */
                getProjectStatistics: function (project, callback) {
                    var retVal = $http.get($rootScope.config.server + '/project/' + project.id + '/statistics')
                        .success(function (data) {
                            $log.info('Project statistic loaded.');
                            if (callback) {
                                callback(data);
                            }
                        })
                        .error(function (data, status) {
                            $log.info('Cannot load project statistics.' + status + ' / ' + data);
                        });

                    return retVal;
                },

                /**
                 * getManagementBookingStat - Resolves booking statistics
                 *
                 * @param  {type} callback description
                 * @return {type}          description
                 */
                getManagementBookingStat: function (callback) {
                    var retVal = $http.get($rootScope.config.server + '/stat/management/booking')
                        .success(function (data) {
                            $log.info('Booking statistic loaded.');
                            if (callback) {
                                callback(data);
                            }
                        })
                        .error(function (data, status) {
                            $log.info('Cannot load Booking statistics.' + status + ' / ' + data);
                        });

                    return retVal;
                },


                /**
                 * getUserBookingStat - Resolves booking statistics of a user
                 *
                 * @param  {type} callback description
                 * @return {type}          description
                 */
                getUserBookingStat: function (callback) {
                    var retVal = $http.get($rootScope.config.server + '/stat/user/booking')
                        .success(function (data) {
                            $log.info('User Booking statistic loaded.');
                            if (callback) {
                                callback(data);
                            }
                        })
                        .error(function (data, status) {
                            $log.info('Cannot load User Booking statistics.' + status + ' / ' + data);
                        });

                    return retVal;
                },

                /**
                 * getUserColleges - Resolves colleges of user
                 *
                 * @param  {type} callback description
                 * @return {type}          description
                 */
                getUserColleges: function (callback) {
                    var retVal = $http.get($rootScope.config.server + '/stat/user/colleges')
                        .success(function (data) {
                            $log.info('User colleges loaded.');
                            if (callback) {
                                callback(data);
                            }
                        })
                        .error(function (data, status) {
                            $log.info('Cannot load User colleges statistics.' + status + ' / ' + data);
                        });

                    return retVal;
                }
            };
        }
    ]);
