'use strict';

angular.module('timetrackerApp.service.projects', ['ngCookies'])

.factory('projectService', ['$rootScope', '$location', '$http', '$log',
  function($rootScope, $location, $http, $log) {
    return {
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
      }
    };
  }
]);