/*global angular*/

angular.module('timetrackerApp.model.user', ['ngResource', 'ngCookies'])
  .factory('UserModel',
  function ($rootScope, $http, $resource, $log, $cookieStore, $q, $location) {
    'use strict';
    var user = {
      data: null,
      authToken: null,
      initLoaded: false,

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
