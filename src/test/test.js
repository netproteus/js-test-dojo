(function () {
    "use strict";

    require.config({

        // base url for all js files - not the tests though
        baseUrl: '../js',

        // this is populated by the build process
        deps: '{{TESTS}}',

        // when all dependencies have been loaded run Mocha
        callback: function() {
            mocha.run();
        }

    });

})();