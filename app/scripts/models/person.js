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
         * Updates person
         *
         * @param person
         * @param callback
         * @returns {*}
         */
        updatePerson: function (person, callback) {
          var retVal = personResource.update(person, function (data) {
            if (callback) {
              callback(data);
            }
          });
          return retVal.$promise;
        },

        /**
         * Resolves a list of all person
         * @param callback
         * @returns {*}
         */
        listPerson: function (callback) {
          var retVal = personResource.query(function (data) {
            if (callback) {
              callback(data);
            }
          });
          return retVal.$promise;
        },


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