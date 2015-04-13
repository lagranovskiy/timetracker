'use strict';

angular.module('timetrackerApp.service.projects', ['ngCookies'])

/**
 * Project Service handels mixed functionality for Project Entities
 */
.factory('projectService', ['$rootScope', '$location', '$http', '$log',
  function($rootScope, $location, $http, $log) {
    return {


      /**
       * getProjectStatistic - Resolves project statistics
       *
       * @param  {type} project  description
       * @param  {type} callback description
       * @return {type}          description
       */
      getProjectStatistics: function(project, callback) {
        var retVal = $http.get($rootScope.config.server + '/project/' + project.id + '/statistics')
          .success(function(data) {
            $log.info('Project statistic loaded.');
            if (callback) {
              callback(data);
            }
          })
          .error(function(data, status) {
            $log.info('Cannot load project statistics.' + status + ' / ' + data);
          });

        return retVal;
      },


      /**
       * getProjectResources - Resolve all project resources
       *
       * @param  {type} project  description
       * @param  {type} callback description
       * @return {type}          description
       */
      getProjectResources: function(project, callback) {
        var retVal = $http.get($rootScope.config.server + '/project/' + project.id + '/resources')
          .success(function(data) {
            $log.info('Project resources loaded.');
            if (callback) {
              callback(data);
            }
          })
          .error(function(data, status) {
            $log.info('Cannot load project resources.' + status + ' / ' + data);
          });

        return retVal;
      },


      /**
       * getProjectBookings - Resovle all project bookings
       *
       * @param  {type} project  description
       * @param  {type} callback description
       * @return {type}          description
       */
      getProjectBookings: function(project, callback) {
        var retVal = $http.get($rootScope.config.server + '/project/' + project.id + '/bookings')
          .success(function(data) {
            $log.info('Project bookings loaded.');
            if (callback) {
              callback(data);
            }
          })
          .error(function(data, status) {
            $log.info('Cannot load project bookings.' + status + ' / ' + data);
          });

        return retVal;
      },


      /**
       * getVisibleProjects - Returns user assigned projects
       *
       * @param  {Function} callback callback method
       * @return {Promise}          promise
       */
      getUserProjects: function(callback) {
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
       * getVisibleProjects - Returns user assigned projects
       * Only for admins
       *
       * @param  {Function} callback callback method
       * @return {Promise}          promise
       */
      getUserProjectsByUserId: function(userId, callback) {
        var retVal = $http.get($rootScope.config.server + '/admin/user/'+userId+'/projects')
          .success(function(data) {
            $log.info('Visible projects of user '+userId+' loaded.');
            if (callback) {
              callback(data);
            }
          })
          .error(function(data, status) {
            $log.info('Cannot get visible projects of user'+userId+'.' + status + ' / ' + data);
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
      getUserProjectBookings: function(project, callback) {
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
