'use strict';

/**
 * Provides authentication
 *
 * https://github.com/angular-app/angular-app/blob/master/client/src/app/app.js
 * https://github.com/angular-app/angular-app/blob/master/client/src/common/security/security.js
 */
angular.module('timetrackerApp.service.security', ['ngCookies'])

.factory('security', ['$rootScope', '$location', '$cookies', '$cookieStore',
  '$log', '$q', 'UserModel',
  function($rootScope, $location, $cookies, $cookieStore, $log, $q, UserModel) {
    //var url = $rootScope.urls.loginRedirect;

    return {

      isAuthenticatied: function() {
        if (UserModel.data && UserModel.data.session) {
          return true;
        } else {
          return false;
        }
      },

      redirectToLogin: function() {
        $location.path('login');
      }

    };
  }
]);