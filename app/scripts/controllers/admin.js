'use strict';
/*global _*/

/**
 * Project board controller
 */
angular.module('timetrackerApp.controller.admin', [])
    .controller('AdminCtrl', function ($scope, $q, UserModel, PersonModel, BookingModel, ProjectModel) {

        $scope.userList = [];

        $scope.groupList = [];

        $scope.selectedUser = null;
        $scope.selectedUserBookings = [];
        $scope.selectedUserProjects = [];

        $scope.refreshCurrentUser = function () {
            var updatedUser = _.find($scope.userList, function (userEntry) {
                return userEntry && userEntry.user.id === $scope.selectedUser.user.id;
            });
            $scope.selectUser(updatedUser);
        };

        /**
         * Resets user password
         * @returns {*}
         */
        $scope.resetUserPassword = function () {
            UserModel.resetUserPassword($scope.selectedUser.user)
                .then(function (data) {
                    $scope.selectedUser.pwdReset = data.data.resettedPassword;
                }, $scope.showError);
        };

        $scope.deactivateUser = function () {
            $scope.selectedUser.user.active = false;
            UserModel.updateUser($scope.selectedUser.user)
                .then(function () {
                    $scope.init()
                        .then($scope.refreshCurrentUser, $scope.showError);
                }, $scope.showError);

        };

        $scope.activateUser = function () {
            $scope.selectedUser.user.active = true;
            UserModel.updateUser($scope.selectedUser.user)
                .then(function () {
                    $scope.init()
                        .then($scope.refreshCurrentUser, $scope.showError);
                }, $scope.showError);
        };


        $scope.updateGroup = function (group) {
            UserModel.changeUserGroup($scope.selectedUser.user, group)
                .then(function () {
                    $scope.init()
                        .then($scope.refreshCurrentUser, $scope.showError);
                }, $scope.showError);
        };

        /**
         * Updates currently selected person
         */
        $scope.updatePerson = function () {
            PersonModel.updatePerson($scope.selectedUser.person)
                .then(function () {
                    $scope.init()
                        .then($scope.refreshCurrentUser, $scope.showError);
                }, $scope.showError);
        };

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
                }, $scope.showError);

            ProjectModel.getUserProjectsByUserId(user.user.id)
                .then(function (data) {
                    $scope.selectedUserProjects = data.data.records;
                }, $scope.showError);
        };

        /**
         * Initializes the booking page with start data
         */
        $scope.init = function () {

            return $q.all([

            /**
             * Load user data
             */
                UserModel.getResolvedUsers().then(function (data) {
                    $scope.userList = data;
                }, $scope.showError),
            /**
             * Resolve groups
             */
                UserModel.getAllGroups().then(function (data) {
                    $scope.groupList = data;
                }, $scope.showError)


            ]);

        };

        $scope.init();

    });
