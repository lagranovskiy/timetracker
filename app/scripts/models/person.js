/* global angular */

angular.module('timetrackerApp.model.person', ['ngResource'])
  .factory('PersonModel',
    function($rootScope, $resource) {
      'use strict';

      var personResource = $resource($rootScope.config.server + '/person/:personId', {
        personId: '@id'
      }, {
        update: {
          method: 'PUT'
        }
      });

      var roleResource = $resource($rootScope.config.server + '/role/');

      var person = {

        resource: personResource,

        roleResource: roleResource,


        /**
         * produceNewProject - Produces a new project instance
         *
         * @return {type}  description
         */
        produceNewPerson: function() {
          return {
            id: null,
            projectId: null,
            projectName: null
          };
        }
      };

      return person;
    });