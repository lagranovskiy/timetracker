/*global angular*/

angular.module('timetrackerApp.model.user', ['ngResource', 'ngCookies', ])
  .factory('UserModel',
    function($rootScope, $http, $resource, $log, $cookieStore) {
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

          function(response) {
            $log.log('security init success');
            user.data = response;
            user.setCurrentLanguage(response.locale);
            $rootScope.$broadcast('applicationInitLoaded');
          },

          function() {
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

        /**
         * Evaluates if user is in the given group
         * */
        isUserInGroup: function(group) {
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
        isUserLoggedIn: function() {
          if (!user.data || !user.data.groups) {
            return false;
          }
          return true;
        },

        loginUser: function(credData, callback) {
          $http.post($rootScope.config.server + '/auth/login', credData)
            .success(function(data) {
              $log.info('User authenticated.');
              callback(null, data);
              user.data = data;
            })
            .error(function(data, status) {
              callback(status);
              $log.info('Cannot authenticate user');
            });
        },

        logout: function(callback) {
          $http.post($rootScope.config.server + '/auth/logout')
            .success(function() {
              $log.info('User Logout successful.');
              user.data = null;
              callback(true);
            })
            .error(function(data, status) {
              $log.info('Request responces with ' + status);
              user.data = null;
              callback(false);
            });
        },

        setAuth: function(authToken) {
          user.authToken = authToken;
          if (!user.data) {
            $http.get($rootScope.config.server + '/auth')
              .success(function(data) {
                $log.info('User authenticated.');
                user.data = data;
              })
              .error(function() {
                $log.info('Cannot get user data');
              });
          }
        },


        getSetting: function(name, defaultVal) {
          if (user.localSettings[name] === undefined) {
            user.updateSetting(name, defaultVal);
          }

          return user.localSettings[name];
        },
        /**
         * updates setting storage
         */
        updateSetting: function(name, value) {
          if (!name) {
            return;
          }

          user.localSettings[name] = value;
          $cookieStore.put('timetracker-pac', user.localSettings);
        },

        load: function(options) {
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
  );