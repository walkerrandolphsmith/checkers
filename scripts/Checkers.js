/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = classie;
} else {
  // browser global
  window.classie = classie;
}

})( window );

angular.module('Micro.services', []);
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
angular.module('Micro.directives', []);
'use strict'

angular.module('Micro.directives')
    .directive('autoGrow', function () {
        return function(scope, element, attr) {
            var minHeight, paddingLeft, paddingRight, $shadow = null;

            function createShadow(){

                minHeight = element[0].offsetHeight;
                if (minHeight === 0)
                    return ;
                paddingLeft = element.css('paddingLeft');
                paddingRight = element.css('paddingRight');

                $shadow = angular.element('<div></div>').css({
                    position: 'absolute',
                    top: -10000,
                    left: -10000,
                    width: element[0].offsetWidth - parseInt(paddingLeft ? paddingLeft : 0, 10) - parseInt(paddingRight ? paddingRight : 0, 10),
                    fontSize: element.css('fontSize'),
                    fontFamily: element.css('fontFamily'),
                    lineHeight: element.css('lineHeight'),
                    resize: 'none'
                });
                angular.element(document.body).append($shadow);

            }

            var update = function() {
                if ($shadow === null)
                    createShadow();
                if ($shadow === null)
                    return ;
                var times = function(string, number) {
                    for (var i = 0, r = ''; i < number; i++) {
                        r += string;
                    }
                    return r;
                };

                var val = element.val().replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/&/g, '&amp;')
                    .replace(/\n$/, '<br/>&nbsp;')
                    .replace(/\n/g, '<br/>')
                    .replace(/\s{2,}/g, function(space) { return times('&nbsp;', space.length - 1) + ' '; });
                $shadow.html(val);

                element.css('height', Math.max($shadow[0].offsetHeight + 30, minHeight) + 'px');
            };

            element.bind('keyup keydown keypress change focus', update);
            scope.$watch(attr.ngModel, update);
            scope.$watch(function(){ return element[0].style.display != 'none'; }, update);
        };
    });
'use strict'

angular.module('Micro.directives')
    .directive('board', ['$log', function ($log) {

        var isLightTurn = true;

        function getIsLightTurn(){
            return isLightTurn;
        }
        function setIsLightTurn(state){
            isLightTurn = state;
        }

        function isSelectable(index) {
            var pos = getCoordinatesGivenIndex(index);

            var isRowEven = pos.row % 2;
            var isColumnEven = pos.column % 2;

            return (isRowEven != isColumnEven) ? true : false;
        }

        function setup() {
            var numberOfPositions = 8 * 8;

            for (var i = 0; i < numberOfPositions; i++) {
                var element = document.createElement('div');
                element.classList.add('square');
                $('#board').append(element);
            }

            $('.square').each(function (index, element) {
                var shade = (isSelectable(index) === false) ? 'light' : 'dark';
                element.classList.add(shade);
            });
        }

        function addPieces() {

            $('.square.dark').each(function (index, element) {
                var $square = $(element);
                var pieceDiv = document.createElement('div');
                pieceDiv.classList.add('piece');
                $square.append(pieceDiv);
            });

            var numberOfPieces = 24;
            for (var i = 0; i < numberOfPieces; i++) {
                var newPiece = document.createElement('div');
                newPiece.classList.add('piece');
                if (i > 11) {
                    var row = Math.floor(i / 4) + 2;
                    newPiece.classList.add('light');
                } else {
                    var row = Math.floor(i / 4);
                    newPiece.classList.add('dark');
                }
                var column = (i % 4) * 2 + (1 - row % 2);

                var $containerSquare = getSquareGivenCoordinates(row, column);
                $containerSquare.html(newPiece);
            }
        }

        /***********************************BOARD IS SET**********************************************/

        function gamePlay() {

            setScore();

            $('.square').on("click", function () {
                var square = $(this);
                var index = getIndexGivenSquare(square);
                var piece = getPiece(square);

                //Selection of your piece
                if(!square.hasClass('available')) {
                    setSelectable();
                    select(piece);
                    piece.parent().removeClass("selectable");
                    var availableIndices = getAvailableIndicies(index);
                    setAvailable(availableIndices);

                }else{//your selection of an available square

                    var oldPiece = $('.selected');
                    var wasKing = oldPiece.hasClass('king');
                    var oldSquare = $('.selected').parent();
                    var oldIndex = getIndexGivenSquare(oldSquare);

                    var didJump = false;

                    var removePiece = null;

                    if(index - 14 === oldIndex){//SW
                        removePiece = getSquareGivenIndex(index - 7);
                    }else if(index - 18 === oldIndex){//SE
                        removePiece = getSquareGivenIndex(index - 9);
                    }else if(index + 14 === oldIndex){//NE
                        removePiece = getSquareGivenIndex(index + 7);
                    }else if(index + 18 === oldIndex){//NW
                        removePiece = getSquareGivenIndex(index + 9);
                    }

                    if(removePiece !== null) {
                        var color = getColor(!getIsLightTurn());
                        getPiece(removePiece).removeClass(color);
                        didJump = true;
                    }

                    oldPiece.removeClass(getColor(getIsLightTurn()));
                    oldPiece.removeClass('selected');
                    oldPiece.removeClass('king');


                    piece.addClass(getColor(getIsLightTurn()));
                    piece.addClass("selected");

                    if(isNowKing(index) || wasKing){
                        piece.addClass('king');
                    }

                    if(didJump){
                        setScore();
                        var availableIndices = getAvailableIndicies(index);

                        availableIndices = _.reject(availableIndices, function(tile){
                            var sw = tile.nextIndex - 14 === index;
                            var se = tile.nextIndex - 18 === index;
                            var ne = tile.nextIndex + 14 === index;
                            var nw = tile.nextIndex + 18 === index;

                            return !(sw || se || ne || nw);
                        });

                        if(availableIndices.length > 0){
                            setAvailable(availableIndices);
                        }else{
                            nextTurn();
                        }
                    }else{
                        nextTurn();
                    }
                }
            });
        }

        function setScore(){

            var scoreLight, scoreDark;

            var numDarkPieces = getNumberOfPieces(isLightTurn);
            var numLightPieces = getNumberOfPieces(!isLightTurn);

            if(numDarkPieces === 0){
                scoreLight = "Winner";
                scoreDark = "Loser";
            }else if (numLightPieces === 0){
                scoreLight = "Loser";
                scoreDark = "Winner";
            }else{
                scoreLight = numLightPieces;
                scoreDark = numDarkPieces;
            }

            $('.score #light').text(scoreLight);
            $('.score #dark').text(scoreDark);

        }

        function nextTurn(){
            setIsLightTurn(!getIsLightTurn());
            setSelectable();
            resetAvailable();
        }

        /***********************************Game LOOP**********************************************/

        function getNumberOfPieces(isLightTurn){
            return getPieces(isLightTurn).length;
        }

        function isPiece(index){
            return isLight(index) || isDark(index);
        }

        function isYourPiece(index){
            return (isLight(index) && getIsLightTurn())
                || (isDark(index) && !getIsLightTurn());
        }

        function isTheirPiece(index){
            return (isLight(index) && !getIsLightTurn())
                || (isDark(index) && getIsLightTurn());
        }

        function isLight(index){
             var square = getSquareGivenIndex(index);
             return getPiece(square).hasClass('light');
        }

        function isDark(index){
            var square = getSquareGivenIndex(index);
            return getPiece(square).hasClass('dark');
        }

        function getPiece(square){
            return square.children();
        }

        function isKing(piece){
            return piece.hasClass('king');
        }

        function isNowKing(index){
            return (getIsLightTurn() && isTopMostRow(index)) || (!getIsLightTurn() && isBottomMostRow(index))
        }

        function getPieces(isLightTurn){
            var selectable = getColor(isLightTurn);
            return  $('.piece.' + selectable);
        }

        function getColor(isLightTurn){
            return (isLightTurn ? 'light' : 'dark');
        }

        /***********************************PIECE**********************************************/

        function getSquareGivenCoordinates(row, column) {
            var index = getIndexGivenCoordinates(row, column);
            return getSquareGivenIndex(index);
        }

        function getIndexGivenCoordinates(row, column) {
            return (8 * row) + column;
        }

        function getIndexGivenSquare($square) {
            return $('.square').index($square);
        }

        function getSquareGivenIndex(index) {
            return $('.square:nth-child(' + (index + 1) + ')');
        }

        function getCoordinatesGivenIndex(index) {
            var row = Math.floor(index / 8);
            var column = index % 8;

            return {column: column, row: row};
        }

        var move = {
            ne: GetIndexNorthEast,
            nw: GetIndexNorthWest,
            se: GetIndexSouthEast,
            sw: GetIndexSouthWest
        }

        function GetIndexNorthEast(index) {
            return index - 8 + 1;
        }

        function GetIndexNorthWest(index) {
            return index - 8 - 1;
        }

        function GetIndexSouthEast(index) {
            return index + 8 + 1;
        }

        function GetIndexSouthWest(index) {
            return index + 8 - 1;
        }

        function isDivisibleBy(a, b){
            return a % b === 0;
        }

        function isRightMostColumn(index){
            return index !== 0 && isDivisibleBy(index+1, 8);
        }

        function isLeftMostColumn(index){
            return index === 0 || isDivisibleBy(index, 8);
        }

        function isTopMostRow(index){
            return index < 8;
        }

        function isBottomMostRow(index){
            return index > 55;
        }

        function isOccupied(index, directions){
            var omittedDirections = [];
            _.each(directions, function(direction){
                var nextIndex = move[direction](index);
                if(isYourPiece(nextIndex)) {
                    omittedDirections.push(direction);
                }
            });
            return omittedDirections;
        }

        function trim(index, directions) {
            var square = getSquareGivenIndex(index);
            var piece = getPiece(square);

            var trimMoves = {
                isLight: isLight(index) && !isKing(piece) ? ["se", "sw"] : [],
                isDark: isDark(index) && !isKing(piece) ? ["ne", "nw"] : [],
                isOccupied: isOccupied(index, directions),
                isTopMostRow: (isTopMostRow(index)? ['ne', 'nw'] : []),
                isBottomMostRow: (isBottomMostRow(index)? ['se', 'sw'] : []),
                leftMostColumn: (isLeftMostColumn(index) ? ["nw", "sw"] : []),
                rightMostColumn: (isRightMostColumn(index) ? ["ne", "se"] : [])
            }
            for(var prop in trimMoves){
                directions = _.difference(directions, trimMoves[prop])
            }
            return directions;
        }

        function getImmediateAvailable(index, directions){
            var availableIndecies = [];
            var _index;

            _.each(directions,function(direction){
                _index = move[direction](index)
                availableIndecies.push({
                    nextIndex: _index,
                    direction: direction
                });
            });

            return availableIndecies;
        }

        function getAvailableIndicies(index){

            var directions = ["ne", "nw", "se", "sw"];
            directions = trim(index, directions);

            var available = getImmediateAvailable(index, directions);

            var jump = getJumpableIndicies(index,available);

            var jumpTo = jump[0];
            var removeList = jump[1];

            available = _.union(jumpTo, available);

            available = _.reject(available, function(a){
                var remove = false;
                _.each(removeList, function(toRemove){
                    if(a.nextIndex == toRemove.nextIndex &&
                        a.direction == toRemove.direction){
                        remove = true;
                    }
                });
                return remove;
            });

            return available;
        }

        function getJumpableIndicies(index, availableJumps){
            var availableIndicies = [];
            var removeList = []

            _.each(availableJumps, function(availableJump){

                var _index = availableJump.nextIndex;
                var direction = availableJump.direction;

                if(isTheirPiece(_index)) {
                    var canNotJump = true;
                    switch (direction) {
                        case 'ne':
                            canNotJump = isRightMostColumn(_index) || isTopMostRow(_index);
                            break;
                        case 'nw':
                            canNotJump = isLeftMostColumn(_index) || isTopMostRow(_index);
                            break;
                        case 'se':
                            canNotJump = isRightMostColumn(_index) || isBottomMostRow(_index);
                            break;
                        case 'sw':
                            canNotJump = isLeftMostColumn(_index) || isBottomMostRow(_index);
                            break;
                    }

                    if (!canNotJump) {
                        var landingIndex = move[direction](_index);

                        if (!isPiece(landingIndex)) {
                            availableIndicies.push({
                                nextIndex: landingIndex,
                                direction: direction
                            });
                        }
                    }

                    removeList.push({
                        nextIndex: _index,
                        direction: direction
                    });
                }
            });

            return [availableIndicies, removeList];
        }

        function resetAvailable(){
            $('.square').each(function(index, square){
                if(isSelectable(index) !== false){
                    $(square).removeClass("available");
                }
            });
        }

        function setAvailable(indicies) {
            resetAvailable();
            _.each(indicies, function(i){
                console.log("MOVE I", i);
                var moveTo = getSquareGivenIndex(i.nextIndex);
                moveTo.addClass('available');
            });
        }

        function select(piece) {
            $(".piece").not(piece).removeClass("selected");
            piece.addClass("selected");
        }

        function setSelectable(){
            $(".selectable").removeClass('selectable');

            var yourPieces = getPieces(getIsLightTurn());

            yourPieces.each(function(index, piece){
                var square = $(piece).parent();
                var index = getIndexGivenSquare(square);
                var avialable = getAvailableIndicies(index);

                if(avialable.length > 0) {
                    square.addClass('selectable');
                }
            });

        }

        function start() {
            setup();
            addPieces();
            setSelectable();
            gamePlay();
        }

        function linker($scope, $element, $attrs) {
            start();
        }

        return {
            restrict: 'EA',
            replace: false,
            transclude: true,
            controller: function ($scope, $element) {

            },
            compile: function (element, attrs) {
                return {
                    post: linker
                };
            }
        }
    }]);
'use strict'

angular.module('Micro.directives')
    .directive('scroller', ['$window', function($window) {

        var docElem = $window.document.documentElement;

        function getViewportH() {
            var client = docElem['clientHeight'],
                inner = $window['innerHeight'];

            if( client < inner )
                return inner;
            else
                return client;
        }

        function scrollY(){
            return $window.pageYOffset || docElem.scrollTop;
        }

        // http://stackoverflow.com/a/5598797/989439
        function getOffset( el ) {

            var offsetTop = 0, offsetLeft = 0;
            do {
                if ( !isNaN( el.offsetTop ) ) {
                    offsetTop += el.offsetTop;
                }
                if ( !isNaN( el.offsetLeft ) ) {
                    offsetLeft += el.offsetLeft;
                }
            } while( el = el.offsetParent )
            return {
                top : offsetTop,
                left : offsetLeft
            }
        }

        function inViewport( el, h ) {
            var elH = el.offsetHeight;
            var scrolled = scrollY();
            var viewed = scrolled + getViewportH();
            var elTop = getOffset(el).top;
            var elBottom = elTop + elH;
            // if 0, the element is considered in the viewport as soon as it enters.
            // if 1, the element is considered in the viewport only when it's fully inside
            // value in percentage (1 >= h >= 0)
            h = h || 0;

            return (elTop + elH * h) <= viewed && (elBottom) >= scrolled;
        }

        function extend( a, b ) {
            for( var key in b ) {
                if( b.hasOwnProperty( key ) ) {
                    a[key] = b[key];
                }
            }
            return a;
        }

        function scroller( el, options ) {
            this.el = el;
            this.options = extend( this.defaults, options );
            this._init();
        }

        scroller.prototype = {
            defaults : {
                viewportFactor : 0.2
            },
            _init : function() {
                if( Modernizr.touch ) return;
                this.sections = Array.prototype.slice.call( this.el.querySelectorAll( '.cbp-so-section' ) );
                this.didScroll = false;

                var self = this;
                // the sections already shown...
                this.sections.forEach( function( el, i ) {
                    if( !inViewport( el ) ) {
                        classie.add( el, 'cbp-so-init' );
                    }
                } );

                var scrollHandler = function() {
                        if( !self.didScroll ) {
                            self.didScroll = true;
                            setTimeout( function() { self._scrollPage(); }, 60 );
                        }
                    },
                    resizeHandler = function() {
                        function delayed() {
                            self._scrollPage();
                            self.resizeTimeout = null;
                        }
                        if ( self.resizeTimeout ) {
                            clearTimeout( self.resizeTimeout );
                        }
                        self.resizeTimeout = setTimeout( delayed, 200 );
                    };

                $window.addEventListener( 'scroll', scrollHandler, false );
                $window.addEventListener( 'resize', resizeHandler, false );
            },
            _scrollPage : function() {
                var self = this;

                this.sections.forEach( function( el, i ) {
                    if( inViewport( el, self.options.viewportFactor ) ) {
                        classie.add( el, 'cbp-so-animate' );
                    }
                    else {
                        // items initially in the viewport will also animate on scroll
                        classie.add( el, 'cbp-so-init' );
                        classie.remove( el, 'cbp-so-animate' );
                    }
                });
                this.didScroll = false;
            }
        }

        var linker = function(scope, elm, attrs) {
            console.log(elm[0])
            new scroller(elm[0]);
        };

        return {
            restrict: 'A',
            link: linker
        }
    }]);
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
angular.module('Micro.controllers', []);
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
angular.module('Micro.filters', []);
angular.module('Micro.filters')
    .filter('version', function() {
        return function(text, version) {
            return String(text).replace('VERSION', version);
        };
    });
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
            "****************************************",
            "****************************************"
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