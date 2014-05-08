function setup() {
    var numberOfPositions = 8*8;

    for(var i = 0; i < numberOfPositions; i++){
        var element = document.createElement('div');
        element.classList.add('square');
        $('#board').append(element);
    }

    $('.square').each(function(index, element){
        //var $square = $(element);
        var shade = (isDark(index) === false) ? 'light' : 'dark';
        element.classList.add(shade);
    });

    function isDark(index){
        var row = Math.floor(index / 8);
        var column = index % 8;

        var isRowEven = (row % 2 === 0) ? true : false;
        var isColumnEven = (column % 2 === 0) ? true : false;

        return (isRowEven != isColumnEven) ? true: false;
    }
}