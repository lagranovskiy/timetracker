'use strict';

angular.module('timetrackerApp.service.assignment', ['ngCookies'])

/**
 * Project Service handels mixed functionality for Project Entities
 */
.factory('assignmentService', ['$rootScope', '$location', '$http', '$log', '$q',
  function($rootScope, $location, $http, $log, $q) {
    return {


      /**
       * commitProjectAssignments - Commits project assignemnts to the server
       *
       * @param  {type} projectId      id of the project
       * @param  {type} assignmentList list of assignments in form [{person:[{},{}], role: ''}]
       * @param  {type} callback       description
       * @return {type}                description
       */
      commitAssignments: function(assignmentList, callback) {
        if (!assignmentList) {
          var defer = $q.defer();
          defer.reject('Cannot commit assignments list null');
          return defer.promise;
        }
        var retVal = $http.put($rootScope.config.server + '/assignment/', assignmentList)
          .success(function(data) {
            $log.info('Assignments was commited successfully.');
            if (callback) {
              callback(data);
            }
          })
          .error(function(data, status) {
            $log.info('Caanot commit assignments.' + status + ' / ' + data);
          });

        return retVal;
      },



      /**
       * removeAssignment - Removes existing assignment
       *
       * @param  {type} assignmentId description
       * @param  {type} callback     description
       * @return {type}              description
       */
      removeAssignment: function(assignmentId, callback) {
        if (!assignmentId) {
          var defer = $q.defer();
          defer.reject('Cannot delete assignment null');
          return defer.promise;
        }
        var retVal = $http.delete($rootScope.config.server + '/assignment/' + assignmentId)
          .success(function(data) {
            $log.info('Assignment was deleted successfully.');
            if (callback) {
              callback(data);
            }
          })
          .error(function(data, status) {
            $log.info('Caanot delete assignments.' + status + ' / ' + data);
          });

        return retVal;
      }
    };
  }
]);