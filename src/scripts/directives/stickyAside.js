'use strict'

angular.module('Micro.directives')
.directive('stickyAside', ['$window', function($window) {

    var stickSidebar = function () {

        var sidebarSelector = $(this);
        var viewportHeight = $(window).height();
        var sidebarHeight = sidebarSelector.outerHeight();
        var contentHeight = $('.snap-content').outerHeight();
        var scroll_top = $(window).scrollTop();
        var breakingPoint = 3.5;

        if ((contentHeight > sidebarHeight) && (viewportHeight > sidebarHeight)) {

            if (scroll_top <= breakingPoint) {
                sidebarSelector.css('top', breakingPoint+"em");

            }else{
                sidebarSelector.css('top', scroll_top);
            }

        }
    };

    var linker = function(scope, elm, attrs) {
        $window.addEventListener( 'scroll', $.proxy(stickSidebar, elm[0]), false );
        $window.addEventListener( 'resize', $.proxy(stickSidebar, elm[0]), false );
    };

    return {
        restrict: 'A',
        link: linker
    }
}]);