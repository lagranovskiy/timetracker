'use strict';
/* global TimetrackerConfiguration*/

/**
 * @ngdoc overview
 * @name timetrackerClientApp
 * @description
 * # timetrackerClientApp
 *
 * Main module of the application.
 */
angular.module('timetrackerApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',

  'timetrackerApp.model.user',
  'timetrackerApp.model.project',
  'timetrackerApp.model.booking',

  'timetrackerApp.service.security',
  'timetrackerApp.service.bookings',
  'timetrackerApp.service.projects',

  // Controllers
  'timetrackerApp.controller.navbar',
  'timetrackerApp.controller.booking',
  'timetrackerApp.controller.project',
  'timetrackerApp.controller.management',
  'timetrackerApp.controller.admin',
  'timetrackerApp.controller.dashboard',
  'timetrackerApp.controller.login',
  'timetrackerApp.controller.registration'
])

.run(['$rootScope', '$location', '$log',

  function($rootScope, $location) {
    $rootScope.$location = $location;
    $rootScope.config = TimetrackerConfiguration;
  }
])

.factory('authHttpResponseInterceptor', ['$q', '$location', '$log', function($q, $location, $log) {
    return {
      response: function(response) {
        if (response.status === 401) {
          $log.info('Response 401');
        }
        return response || $q.when(response);
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          $log.info('Response Error 401');
          $location.path('/login').search('returnTo', $location.path());
        }
        return $q.reject(rejection);
      }
    };
  }])
  .config(['$httpProvider', function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
  }])

.run(['$rootScope', 'security', '$log',
  function($rootScope, security) {
    $rootScope.$on('$routeChangeStart', function(event, next) {
      if (next.requireLogin) {
        if (!security.isAuthenticatied()) {
          security.redirectToLogin();
        }
      }
    });
  }
])

.config(function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
})

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl',
      requireLogin: true
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      requireLogin: false
    })
    .when('/signup', {
      templateUrl: 'views/signup.html',
      controller: 'RegistrationCtrl',
      requireLogin: false
    })

  .when('/projects', {
      templateUrl: 'views/projects.html',
      controller: 'ProjectCtrl',
      requireLogin: true
    })
    .when('/bookings', {
      templateUrl: 'views/bookings.html',
      controller: 'BookingCtrl',
      requireLogin: true
    })
    .when('/management', {
      templateUrl: 'views/management.html',
      controller: 'ManagementCtrl',
      requireLogin: true
    })
    .when('/administration', {
      templateUrl: 'views/administration.html',
      controller: 'AdminCtrl',
      requireLogin: true
    })
    .otherwise({
      redirectTo: '/'
    });
});