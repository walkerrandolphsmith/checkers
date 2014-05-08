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

        $('.piece').on("click",function(){

            var self = $(this);
            $(".piece").not(self).removeClass("selected");
            self.toggleClass("selected");
        });

        $('.square').on("click", function(){

        });
    }




    return obj;
});
