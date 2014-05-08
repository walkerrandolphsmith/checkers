define([
        "knockout",
        "durandal/app",
        "models/game"
], function (
        ko,
        app,
        Game
    ) {
	"use strict";

    var obj = {
        activate: activate,
        attached: attached,
        compositionComplete: compositionComplete
    };

    function  activate () {

    };

    function attached(view, parent){
        //alert($(view).html());
    };

    function compositionComplete(child, parent, settings){
        setup();
        addPieces();
        gamePlay();
        /*
        $('.piece').on("click",function(){

            var $this = $(this);
            $(".piece").not($this).removeClass("selected");
            $this.toggleClass("selected");
        });

        $('.square').on("click", function(){
            var $this = $(this);
            //if($this.hasClass('available')){
                var $currentPiece = $('.selected');
                if($currentPiece.length == 1){
                    //move the currentPiece to self
                    var index = $('.square').index($this);

                    var column = index % 8;
                    var row = Math.floor(index / 8);

                    move($currentPiece, column*42, row*42);

                    $currentPiece.removeClass('selected');
                }
            //}
        });*/
    }




    return obj;
});
