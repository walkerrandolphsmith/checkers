var board = {
    config : {
        width: 42,
        height: 42
    }
}

function move($piece, x, y){
    $piece.css('top', x * board.config.width + "px");
    $piece.css('left', y * board.config.width + "px");
}

function setup() {
    var numberOfPositions = 8 * 8;

    for(var i = 0; i < numberOfPositions; i++){
        var element = document.createElement('div');
        element.classList.add('square');
        $('#board').append(element);
    }

    $('.square').each(function(index, element){
        var shade = (isDark(index) === false) ? 'light' : 'dark';
        element.classList.add(shade);
    });
}

function isDark(index){
    var row = Math.floor(index / 8);
    var column = index % 8;

    var isRowEven = row % 2;
    var isColumnEven = column % 2;

    return (isRowEven != isColumnEven) ? true: false;
}

function addPieces(){
    var numberOfPieces = 24;
    for(var i = 0; i < numberOfPieces; i++){
        var element = document.createElement('div');
        element.classList.add('piece');
        $('#pieces').append(element);
    }
    $('.piece').each(function(index, element){
        if(index > 11){
          var row = Math.floor(index/4) + 2;
            element.classList.add('light');
        }else{
            var row = Math.floor(index/4);
            element.classList.add('dark');
            element.classList.add('king');
        }
        var column = (index % 4) * 2 + (1 - row % 2);

        move($(element),row, column);
    });
}

function gamePlay(){
    getAvailableSquares();
    $('.piece').on("click",function(){

        var $this = $(this);
        $(".piece").not($this).removeClass("selected");
        $this.toggleClass("selected");
    });

    $('.square').on("click", function(){
        var $this = $(this);
        if($this.hasClass('available')){
            var $currentPiece = $('.selected');
            getAvailableSquares();
            if($currentPiece.length == 1){
                //move the currentPiece to self
                var index = $('.square').index($this);

                var row = Math.floor(index / 8);
                var column = index % 8;

                move($currentPiece, row, column);

                $currentPiece.removeClass('selected');
                $('.square').removeClass('available');
                getAvailableSquares();
            }
        }
    });
}

function getAvailableSquares(){
    var $squares = $('.square');

    var $occupied = $('.piece').map(function(index, piece){
        var position = $(piece).position();
        var indexInSquares = position.top/board.config.width * 8 + position.left/board.config.width;
        return $squares[indexInSquares];
    });
    $('.square.dark').not($occupied).addClass('available');
}