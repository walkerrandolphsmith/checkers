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
        compositionComplete: compositionComplete,
        restart: restart
    };

    function  activate () {

    };

    function attached(view, parent){

    };

    function compositionComplete(child, parent, settings){
        start();
    }

    function start(){
        setup();
        addPieces();
        gamePlay();
    }

    function restart(){
       $('#board').html('');
       start();
    }

    return obj;
});
