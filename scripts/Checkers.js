angular.module('Micro.services', []);
angular.module('Micro.directives', []);
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
angular.module('Micro.controllers', []);
angular.module('Micro.filters', []);
angular.module('Micro.filters')
    .filter('version', function() {
        return function(text, version) {
            return String(text).replace('VERSION', version);
        };
    });
'use strict';

angular.module('CHECKERS', [
    'Micro.services',
    'Micro.directives',
    'Micro.controllers',
    'Micro.filters',
    'ui.bootstrap'
]);
