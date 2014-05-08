define([
      'plugins/router',
      'durandal/app'
],
    function (
        router,
        app
    ) {
        "use strict";

        var obj = {
            router: router,
            activate: function () {

                router.map([
                    { route: '', title: 'Checkers', moduleId: 'viewmodels/home', nav: true },
                    { route: 'source', moduleId: 'viewmodels/score', nav: true }
                ]).buildNavigationModel();

                return router.activate();
            }

        };

        return obj;
    });