/*global angular*/

angular.module('timetrackerApp.model.user', ['ngResource', 'ngCookies'])
    .factory('UserModel', ['$rootScope', '$resource', '$log', '$cookieStore',
        function ($rootScope, $resource, $log, $cookieStore) {
            'use strict';
            var user,
                userResource = null;


            function initUserResource() {
                if (userResource === null) {
                    userResource = $resource($rootScope.config.server + 'user', {}, {
                        'get': {
                            method: 'GET',
                            isArray: false
                        }

                    });
                }
            }



            function load(options) {
                initUserResource();
                userResource.get(
                    options,

                    function (response) {
                        $log.log('security init success');
                        user.data = response;
                        user.setCurrentLanguage(response.locale);
                        $rootScope.$broadcast('applicationInitLoaded');
                    },

                    function () {
                        $log.log('security init failure');
                        user.setCurrentLanguage('en');
                        user.data = null;
                    }
                );
            }



            user = {
                data: null,
                authToken: null,
                initLoaded: false,

                reset: function () {
                    this.data = null;
                },

                setAuth: function (authToken) {
                    user.authToken = authToken;
                },


                getSetting: function (name, defaultVal) {
                    if (user.localSettings[name] === undefined) {
                        user.updateSetting(name, defaultVal);
                    }

                    return user.localSettings[name];
                },
                /**
                 * updates setting storage
                 */
                updateSetting: function (name, value) {
                    if (!name) {
                        return;
                    }

                    user.localSettings[name] = value;
                    $cookieStore.put('timetracker-pac', user.localSettings);
                },

                load: function (options) {
                    var settings = $cookieStore.get('timetracker-pac');
                    if (settings) {
                        user.localSettings = settings;
                    }

                    load(options);
                    this.setInitLoaded(true);
                }

            };

            return user;
        }
    ]);