var board = {
    config : {
        width: 42,
        height: 42
    }
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
    var pos = getCoordinatesGiven(index);

    var isRowEven = pos.row % 2;
    var isColumnEven = pos.column % 2;

    return (isRowEven != isColumnEven) ? true: false;
}

function addPieces(){

     $('.square.dark').each(function(index, element){
     var $square = $(element);
     var pieceDiv = document.createElement('div');
     pieceDiv.classList.add('piece');
     $square.append(pieceDiv);
     });

    var numberOfPieces = 24;
    for(var i = 0; i < numberOfPieces; i++){
        var newPiece = document.createElement('div');
        newPiece.classList.add('piece');
        if(i > 11){
            var row = Math.floor(i/4) + 2;
            newPiece.classList.add('light');
        }else{
            var row = Math.floor(i/4);
            newPiece.classList.add('dark');
        }
        var column = (i % 4) * 2 + (1 - row % 2);

        var $containerSquare = getSquareGivenCoordinates(row, column);
        $containerSquare.html(newPiece);
    }
}

function gamePlay(){
    var isLightTurn = true;

    $('.square').on("click", function(){
        var $this = $(this);
        var index = getIndexGiven($this);
        console.log(index);
        var $children = $this.children();

        if($children.hasClass('light')&&isLightTurn){
            select($this, $children);

        }else if($children.hasClass('dark')&&!isLightTurn){
            select($this, $children);

        }else if($this.hasClass('available')&& $('.selected').length === 1){
            var $selectedPiece = $('.selected');

            //Clean up for next player
            $('.piece').removeClass('selected');
            isLightTurn = !isLightTurn;
            setAvailableSquares($this, false);
        }

        function select (square, children){
            $(".piece").not(children).removeClass("selected");
            children.addClass("selected");
            setAvailableSquares(square, true);
        }

    });
}



function getSquareGivenCoordinates(row, column){
    var $square = null;
    $('.square').each(function(index, element){
        var currentRow = Math.floor(index / 8);
        var currentColumn = index % 8;
        if(row === currentRow && column === currentColumn){
            $square = $(element);
        }
    });
    return $square;
}

function getSquareGiven(index)
{

}

function getIndexGiven($square)
{
    return $('.square').index($square);
}

function getCoordinatesGiven(index)
{
    var row = Math.floor(index / 8);
    var column = index % 8;

    return pos = {column:column, row:row};
}

function setAvailableSquares($square, isEnd){
    if(!isEnd)
        $('.square').removeClass('available');
    else{
        var index = getIndexGiven($square);



        $('.piece').each(function(index, element){
           var $piece = $(element);
           if($piece.hasClass('light')||$piece.hasClass('dark')){

           }else{
               $piece.parent().addClass('available');
           }
       });
    }
}