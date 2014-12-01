'use strict'

angular.module('Micro.services')
    .factory('User', ['$q', function ($q) {

        return Parse.User.extend({
            username: function (){ return this.get('username') },
            password: function (){ return this.get('password') },
            email: function (){ return this.get('email') },
            phone: function (){ return this.get('phone') }
        },{

        });
}]);