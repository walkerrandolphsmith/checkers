angular.module('Micro.filters')
    .filter('version', function() {
        return function(text, version) {
            return String(text).replace('VERSION', version);
        };
    });