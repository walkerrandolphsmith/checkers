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
    var row = Math.floor(index / 8);
    var column = index % 8;

    var isRowEven = row % 2;
    var isColumnEven = column % 2;

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
    setAvailableSquares();
    $('.square').on("click", function(){
        var $this = $(this);
        var index = getIndexOfSquare($this);
        var $children = $this.children();
        //Light's Turn
        if($children.hasClass('light')&&isLightTurn){
            $(".piece").not($children).removeClass("selected");
            $children.addClass("selected");
        //Dark's Turn
        }else if($children.hasClass('dark')&&!isLightTurn){
            $(".piece").not($children).removeClass("selected");
            $children.addClass("selected");
        //Player Move
        }else if($this.hasClass('available')&& $('.selected').length === 1){
            var $selectedPiece = $('.selected');

            //Clean up for next player
            $('.piece').removeClass('selected');
            isLightTurn = !isLightTurn;
            setAvailableSquares();
        }
    });
}

function getIndexOfSquare($square)
{
    return $('.square').index($square);
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

function getSquareGivenIndex(index)
{

}



function setAvailableSquares(){
   $('.piece').each(function(index, element){
       var $piece = $(element);
       if($piece.hasClass('light')||$piece.hasClass('dark')){

       }else{
           $piece.parent().addClass('available');
       }
   });
}