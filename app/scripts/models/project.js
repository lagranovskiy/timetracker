/* global angular */

angular.module('timetrackerApp.model.project', ['ngResource'])
  .factory('ProjectModel',
    function($rootScope, $resource) {
      'use strict';

      var projectResource = $resource($rootScope.config.server + '/project/:projectId', {});

      return projectResource;
    });