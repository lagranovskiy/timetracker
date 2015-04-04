'use strict';

angular.module('timetrackerApp.service.projects', ['ngCookies'])

/**
 * Project Service handels mixed functionality for Project Entities
 */
.factory('projectService', ['$rootScope', '$location', '$http', '$log',
  function($rootScope, $location, $http, $log) {
    return {

      /**
       * getVisibleProjects - Returns user assigned projects
       *
       * @param  {Function} callback callback method
       * @return {Promise}          promise
       */
      getVisibleProjects: function(callback) {
        var retVal = $http.get($rootScope.config.server + '/user/projects')
          .success(function(data) {
            $log.info('Visible projects loaded.');
            if (callback) {
              callback(data);
            }
          })
          .error(function(data, status) {
            $log.info('Cannot get visible projects.' + status + ' / ' + data);
          });

        return retVal;
      },

      /**
       * getProjectBookings - Returns the list of bookings of given project
       *
       * @param  {Object} project  project object to resolve bookings
       * @param  {Function} callback callback method
       * @return {Promise}          promise
       */
      getProjectBookings: function(project, callback) {
        if (!project) {
          return null;
        }
        var retVal = $http.get($rootScope.config.server + '/user/project/' + project.id + '/bookings')
          .success(function(data) {
            $log.info('Bookings of current project loaded.');
            if (callback) {
              callback(data);
            }
          })
          .error(function(data, status) {
            $log.info('Cannot get project bookings.' + status + ' / ' + data);
          });

        return retVal;
      }
    };
  }
]);