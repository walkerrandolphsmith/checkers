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
    }


    return obj;
});
