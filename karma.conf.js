module.exports = function(config) {
    config.set({

        basePath: '',

        frameworks: ['mocha', 'sinon-chai'],

        files: [
           'specs/*'
        ],

        exclude: [],


        preprocessors: {
            'specs/*': ['browserify']
        },

        coverageReporter: {
            type : 'text-summary',
            dir : 'coverage/'
        },
        reporters: ['progress'],

        port: 9876,
        colors: true,
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false
    });
};