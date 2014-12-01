'use strict';

var app = angular.module('CHECKERS', [
    'ui.router',
    'Micro.services',
    'Micro.directives',
    'Micro.controllers',
    'Micro.filters',
    'ui.bootstrap'
]);
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('/', {
            url: "/",
            templateUrl: 'views/game.html'
        })
        .state('/rules', {
            url: "/rules",
            templateUrl: 'views/rules.html'
        })
        .state('/login', {
            url: "/login",
            templateUrl: "views/login.html"
        })
        .state('/signup', {
            url: "/signup",
            templateUrl: "views/signup.html"
        });
})
    .run(function ($rootScope, $state, $window, $location, User) {
        Parse.initialize(
            "gjkjgsFX68XkRYaN0WhdHY733oSrXWPaYeWZ7Cp9",
            "mLf8e3p4QyhKyyTgr8sUVDVReU5S36MzThS1vCzc"
        );
        $rootScope.sessionUser = Parse.User.current();

        $rootScope.logOut = function(form) {
            Parse.User.logOut();
            $rootScope.sessionUser = null;
            $state.go("/");
        };

        $rootScope.deleteAccount = function(){

            $rootScope.sessionUser.destroy({
                success: function(obj){

                },
                error: function(obj){

                }
            });

        };

        $rootScope.$on('$locationChangeSuccess',function(value){
            console.log(value);
        });


    });