/*global angular*/

angular.module('timetrackerApp.model.user', ['ngResource', 'ngCookies'])
    .factory('UserModel',
    function ($rootScope, $http, $resource, $log, $cookieStore, $q, $location) {
        'use strict';

        $rootScope.$on('401', function (event, args) {
            user.data = null;
        });

        var userResource = $resource($rootScope.config.server + '/admin/user/:uid', {
            uid: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });

        var groupResource = $resource($rootScope.config.server + '/group');

        var user = {

            data: null,

            /**
             * Changes currently user group of given user
             *
             * @param user
             * @param group
             * @param callback
             */
            changeUserGroup: function (user, group, callback) {

                var retVal = $http.post($rootScope.config.server + '/admin/user/' + user.uid + '/group/' + group.id)
                    .success(function (data) {
                        $log.info('Group of user '+ user.uid + ' changed.');
                        if (callback) {
                            callback(data);
                        }
                    })
                    .error(function (data, status) {
                        $log.info('Cannot change group of user '+ user.uid + '.' + status + ' / ' + data);
                    });

                return retVal;

            },

            /**
             * Resets user password and returns a new one
             * @param user
             * @param callback
             */
            resetUserPassword: function (user, callback) {
                var retVal = $http.post($rootScope.config.server + '/admin/user/' + user.uid + '/pwdreset')
                    .success(function (data) {
                        $log.info('User password of user '+ user.uid + ' resetted.');
                        if (callback) {
                            callback(data);
                        }
                    })
                    .error(function (data, status) {
                        $log.info('Cannot reset password of user '+ user.uid + '.' + status + ' / ' + data);
                    });

                return retVal;
            },

            /**
             * Changes current password to the given value
             * @param user
             * @param passwordData
             * @param callback
             */
            changeUserPassword: function (user, passwordData, callback) {
                var retVal = $http.post($rootScope.config.server + '/admin/user/' + user.uid + '/pwdchange')
                    .success(function (data) {
                        $log.info('User password of user '+ user.uid + ' changed.');
                        if (callback) {
                            callback(data);
                        }
                    })
                    .error(function (data, status) {
                        $log.info('Cannot cgange password of user '+ user.uid + '.' + status + ' / ' + data);
                    });

                return retVal;
            },


            /**
             * Returns a list of groups
             * {"id":236467,"name":"User","description":"Normal user"}
             * @param callback
             * @returns {*}
             */
            getAllGroups: function (callback) {
                var retVal = groupResource.query(function (data) {
                    if (callback) {
                        callback(data);
                    }
                });

                return retVal.$promise;
            },

            /**
             * Resolves user information inclusibe person data of user
             *
             * [{"user":
       *    {"id":236465,"data":
       *        {"uid":"mdoener","passwordMD5":"secure","registrationDate":"01.01.2003"},
       *        "uid":"mdoener",
       *        "passwordMD5":"secure",
       *        "registrationDate":"01.01.2003",
       *        "groups":["Manager","User"]},
       *
       *  "person":
       *    { "id":236462,
       *      "data":
       *      {"forename":"Michael","phone":"0176/992772","surname":"Döner","email":"mm2@gmx.de","birthday":"18.10.1970"},
             *      "forename":"Michael",
             *      "surname":"Döner",
             *      "birthday":"18.10.1970",
             *      "email":"mm2@gmx.de",
             *      "phone":
             *      "0176/992772"}
             * } ]
             * @param callback
             */
            getResolvedUsers: function (callback) {
                var retVal = userResource.query(function (data) {
                    if (callback) {
                        callback(data);
                    }
                });

                return retVal.$promise;
            },

            /**
             * Updates user data according to security policy
             * @param userData
             * @param callback
             */
            updateUser: function (userData, callback) {
                var retVal = userResource.update(userData, function (data) {
                    if (callback) {
                        callback(data);
                    }
                });

                return retVal.$promise;
            },


            /**
             * Evaluates if user is in the given group
             * */
            isUserInGroup: function (group) {
                if (!user.data || !user.data.groups) {
                    return false;
                }

                for (var i = 0; i < user.data.groups.length; i++) {
                    if (user.data.groups[i] === group) {
                        return true;
                    }
                }

                return false;
            },


            /**
             * Tests if user auth information is set
             * */

            isUserLoggedIn: function () {
                if (user.data) {
                    var defer = $q.defer();
                    defer.resolve(user.data);
                    return defer.promise;
                }
                return $http.get($rootScope.config.server + '/auth')
                    .success(function (data) {
                        $log.info('User authenticated.');
                        user.data = data;
                        $location.path('dashboard');
                    })
                    .error(function () {
                        user.data = null;
                        $location.path('login');
                    });
            },

            loginUser: function (credData, callback) {
                return $http.post($rootScope.config.server + '/auth/login', credData, {
                    withCredential: true
                })
                    .success(function (data) {
                        $log.info('User authenticated.');
                        if (callback) {
                            callback(null, data);
                        }
                        user.data = data;
                    })
                    .error(function (data, status) {
                        if (callback) {
                            callback(status);
                        }
                        $log.info('Cannot authenticate user');
                    });
            },


            /**
             * registerUser - Process user registration
             *
             * @param  {type} userData user data Object
             * @param  {type} callback callback in form (error, data)
             * @return {type}          description
             */
            registerUser: function (userData, callback) {
                return $http.post($rootScope.config.server + '/auth/sign', userData)
                    .success(function (data) {
                        $log.info('User registered.');
                        if (callback) {
                            callback(null, data);
                        }
                        user.data = data;
                    })
                    .error(function (data, status) {
                        if (callback) {
                            callback(status);
                        }
                        $log.info('Cannot register user');
                    });
            },


            logout: function (callback) {
                return $http.post($rootScope.config.server + '/auth/logout')
                    .success(function () {
                        $log.info('User Logout successful.');
                        user.data = null;
                        if (callback) {
                            callback(null, true);
                        }
                    })
                    .error(function (data, status) {
                        $log.info('Request responces with ' + status);
                        user.data = null;
                        if (callback) {
                            callback(status);
                        }
                    });
            }

        };
        user.isUserLoggedIn();

        return user;
    }
);
