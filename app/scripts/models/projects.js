/* global angular */

angular.module('timetrackerApp.model.projects', ['ngResource'])
  .factory('ProjectsModel',
    function($rootScope, $http, $resource, $log) {
      'use strict';

      var projectsModel = {

        getVisibleProjects: function(callback) {
          var retVal = $http.get($rootScope.config.server + '/projects/visible')
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

      };

      return projectsModel;
    });