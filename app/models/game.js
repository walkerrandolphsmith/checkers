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

        var rowOffset = row * board.config.width;
        var columnOffset = column * board.config.height;

        move($(element),rowOffset, columnOffset);
    });

}



function move($piece, x, y){
    $piece.css('top', x + "px");
    $piece.css('left', y + "px");
}