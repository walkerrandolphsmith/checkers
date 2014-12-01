'use strict'

angular.module('Micro.controllers')
    .controller('LoginController',
    ['$rootScope', '$scope', '$state',
        function ($rootScope, $scope, $state) {

            $scope.logIn = function (form) {

                Parse.User.logIn(form.username, form.password, {
                    success: function (user) {

                        $scope.$parent.$parent.sessionUser = user;
                        $state.go('/');

                    },
                    error: function (user, error) {
                        alert("Unable to log in: " + error.code + " " + error.message);
                    }
                });
            };
        }]);