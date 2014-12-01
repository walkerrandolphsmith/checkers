'use strict'

angular.module('Micro.controllers')
    .controller('SignUpController', ['$scope', function ($scope) {

    $scope.signUp = function(form) {
        var user = new Parse.User();
        user.set("email", form.email);
        user.set("username", form.username);
        user.set("password", form.password);
        user.set("phone", form.phone);

        user.signUp(null, {
            success: function(user) {
                $scope.$parent.sessionUser = user;
                $scope.$apply();
            },
            error: function(user, error) {
                alert("Unable to sign up:  " + error.code + " " + error.message);
            }
        });
    };
}]);