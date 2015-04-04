/* global angular */

angular.module('timetrackerApp.model.project', ['ngResource'])
  .factory('ProjectModel',
    function($rootScope, $resource, projectService) {
      'use strict';

      var projectResource = $resource($rootScope.config.server + '/project/:projectId', {
        projectId: '@id'
      }, {
        update: {
          method: 'PUT'
        }
      });

      var project = {
        resource: projectResource,


        /**
         * resolveProjectStatistics - Resolves statistics of the project
         *
         * @param  {type} project  description
         * @param  {type} callback description
         * @return {type}          description
         */
        getProjectStatistics: function(project, callback) {
          return projectService.getProjectStatistics(project, callback);
        },


        /**
         * getProjectResources - Resolves resource info about project
         *
         * @param  {type} project  description
         * @param  {type} callback description
         * @return {type}          description
         */
        getProjectResources: function(project, callback) {
          return projectService.getProjectResources(project, callback);
        },


        /**
         * getProjectBookings - Resolves bookings of the project
         *
         * @param  {type} project  description
         * @param  {type} callback description
         * @return {type}          description
         */
        getProjectBookings: function(project, callback) {
          return projectService.getProjectBookings(project, callback);
        },


        /**
         * produceNewProject - Produces a new project instance
         *
         * @return {type}  description
         */
        produceNewProject: function() {
          return {
            id: null,
            projectId: null,
            projectName: null,
            customerName: null,
            projectType: null,
            projectStart: new Date(2015, 5, 1, 0, 0, 0).getTime(),
            projectEnd: new Date(2016, 5, 1, 0, 0, 0).getTime(),
            projectResponsible: null,
            description: null,
            createdTime: new Date().getTime(),
            lastUpdatedTime: new Date().getTime()
          };
        }
      };

      return project;
    });