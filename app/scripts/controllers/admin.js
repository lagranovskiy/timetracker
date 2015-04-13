'use strict';

/**
 * Project board controller
 */
angular.module('timetrackerApp.controller.admin', [])
  .controller('AdminCtrl', function ($scope, $q, UserModel, BookingModel, ProjectModel) {

    $scope.userList = [];
    $scope.groupList = [];

    $scope.selectedUser = null;
    $scope.selectedUserBookings = [];
    $scope.selectedUserProjects = [];
    /**
     * Selects active user
     * @param user
     */
    $scope.selectUser = function (user) {
      $scope.selectedUser = user;
      if (!user) {
        $scope.selectedUserBookings = [];
        $scope.selectedUserProjects = [];
        return;
      }
      BookingModel.getUserBookings(user.user.id)
        .then(function (data) {
          $scope.selectedUserBookings = data.data;
        })

      ProjectModel.getUserProjectsByUserId(user.user.id)
        .then(function (data) {
          $scope.selectedUserProjects = data.data.records;
        })
    }


    /**
     * Find a project by id
     * */
    $scope.findProjectNameById = function (projectId) {
      if (!projectId || $scope.selectedUserProjects.length === 0) {
        return '';
      }

      var foundProject = _.findWhere($scope.selectedUserProjects, {
        id: projectId
      });

      if (!foundProject) {
        return '.. removed ..';
      }

      return foundProject.projectName;
    };

    /**
     * Initializes the booking page with start data
     */
    $scope.init = function () {

      $q.all([

      /**
       * Load user data
       */
        UserModel.getResolvedUsers().then(function (data) {
          $scope.userList = data;
        }),
      /**
       * Resolve groups
       */
        UserModel.getAllGroups().then(function (data) {
          $scope.groupList = data;
        })


      ]);

    };


  });
