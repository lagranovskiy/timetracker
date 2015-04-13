/* global angular */

angular.module('timetrackerApp.model.project', ['ngResource'])
  .factory('ProjectModel',
    function($rootScope, $resource, projectService, assignmentService, $q) {
      'use strict';

      var projectResource = $resource($rootScope.config.server + '/project/:id', {
        id: '@id'
      }, {
        update: {
          method: 'PUT'
        }
      });

      var project = {
        resource: projectResource,

        /**
         * Returns projects of given user by id
         *
         * @param userId
         * @param callback
         * @returns {*|Promise}
         */
        getUserProjects: function(callback){
          return projectService.getUserProjects(function(data){
            if(callback){
              callback(data);
            }
          });
        },

        /**
         * Returns projects of given user by id
         *
         * @param userId
         * @param callback
         * @returns {*|Promise}
         */
        getUserProjectsByUserId: function(userId, callback){
          return projectService.getUserProjectsByUserId(userId, function(data){
            if(callback){
              callback(data);
            }
          });
        },

        /**
         * commitProjectAssignments - Commits project assignemnts to the server
         *
         * @param  {type} projectId      id of the project
         * @param  {type} assignmentList list of assignments in form [{person:{}, role: '', project : {}}]
         * @param  {type} callback       description
         * @return {type}                description
         */
        commitProjectAssignments: function(assignmentList, callback) {
          if (!assignmentList || assignmentList.length === 0) {
            var defer = $q.defer();
            defer.reject('Cannot commit assignments. Invalid parameter');
            return defer.promise;
          }

          return assignmentService.commitAssignments(assignmentList, callback);
        },

        removeCommitedAssignments: function(assignmentId, callback) {
          if (!assignmentId) {
            var defer = $q.defer();
            defer.reject('Cannot remove assignments. Invalid parameter');
            return defer.promise;
          }

          return assignmentService.removeAssignment(assignmentId, callback);
        },

        /**
         * resolveProjectStatistics - Resolves statistics of the project
         *
         * @param  {type} project  description
         * @param  {type} callback description
         * @return {type}          description
         */
        getProjectStatistics: function(project, callback) {
          if (!project) {
            var defer = $q.defer();
            defer.reject('Cannot resolve project null');
            return defer.promise;
          }
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
          if (!project) {
            var defer = $q.defer();
            defer.reject('Cannot resolve project null');
            return defer.promise;
          }
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
          if (!project) {
            var defer = $q.defer();
            defer.reject('Cannot resolve project null');
            return defer.promise;
          }
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
