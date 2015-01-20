'use strict';

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

    'timetrackerApp.service.security',

    // Controllers
    'timetrackerApp.controller.booking',
    'timetrackerApp.controller.project',
    'timetrackerApp.controller.dashboard',
    'timetrackerApp.controller.login',
    'timetrackerApp.controller.registration'
  ])

.run(['$rootScope', '$location', '$log',

        function ($rootScope, $location, $log) {
        $rootScope.$location = $location;
        $rootScope.config = TimetrackerConfiguration;
        }
        ])

.run(['$rootScope', 'security', '$log',
    function ($rootScope, security, $log) {
        $rootScope.$on('$routeChangeStart', function () {
            if (!security.isAuthenticatied()) {
                $log.error('User is not logged in');
                security.redirectToLogin();
            }
        });
    }])


.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'RegistrationCtrl'
        })

    .when('/projects', {
        templateUrl: 'views/projects.html',
        controller: 'ProjectCtrl'
    })
        .when('/bookings', {
            templateUrl: 'views/bookings.html',
            controller: 'BookingCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});