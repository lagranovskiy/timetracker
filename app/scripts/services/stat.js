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
                }
            };
        }
    ]);
