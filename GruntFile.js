module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'http-server': {
            web: {
                // the server root directory
                root: 'build',

                host: '0.0.0.0',
                port: 8800,

                cache: 1,
                showDir: true,
                autoIndex: true,
                defaultExt: 'html',

                // wait or not for the process to finish
                runInBackground: true
            }
        },

        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/main/',
                    src: ['js/**/*', 'css/**/*.css', '**/*.html'],
                    dest: 'build/'
                }]
            },
            tests: {
                files: [{
                    expand: true,
                    cwd: 'src/test',
                    src: ['**'],
                    dest: 'build/test/'
                }, {
                    src: 'node_modules/grunt-blanket-mocha-badoo/support/mocha-blanket.js',
                    dest: 'build/test/resources/mocha-blanket.js'
                }, {
                    src: 'node_modules/mocha/mocha.js',
                    dest: 'build/test/resources/mocha.js'
                }, {
                    src: 'node_modules/mocha/mocha.css',
                    dest: 'build/test/resources/mocha.css'
                }, {
                    src: 'node_modules/sinon/pkg/sinon.js',
                    dest: 'build/test/resources/sinon.js'
                }, {
                    src: 'node_modules/expect.js/index.js',
                    dest: 'build/test/resources/expect.js'
                }]
            }
        },

        clean: {
            options: {
                force: true
            },
            dev: ['build']
        },

        less: {
            dev: {
                options: {
                    paths: ['src/main/css']
                },
                files: {
                    'build/css/main.css': 'src/main/css/main.less'
                }
            }
        },

        watch: {
            options: {
                spawn: false,
                reload: true
            },
            dev: {
                files: ['src/**'],
                tasks: ['dev']
            }
        },

        tests: {
            prepare: {
                main: 'build/test/test.js',
                files: [{
                    expand: true,
                    cwd: 'src/test',
                    src: ['**/*Test.js']
                }]
            }
        },

        /**
         * Config for the grunt-mocha task. Runs unit tests against phantomjs.
         * See https://github.com/kmiyashiro/grunt-mocha for details
         */
        blanket_mocha: {
            spec: {
                src: 'build/test/index.html',
                options: {
                    reporter: 'Spec',
                    log: true,
                    logErrors: true,
                    threshold: 0,
                    lcovDest: 'build/tests.lcov'
                }
            },
            xunit: {
                dest: 'build/xunit.out',
                src: 'build/test/index.html',
                options: {
                    reporter: 'XUnit',
                    log: true,
                    logErrors: true,
                    threshold: 0,
                    lcovDest: 'build/tests.lcov'
                }
            }
        }

    });

    grunt.registerMultiTask('tests', 'Populates the main.js script for the tests with all the test scripts.', function () {

        // wrap test files in quotes
        var tests = this.files.map(function (files) {
            return '\'' + files.dest + '\'';
        });

        // read main.js
        var main = grunt.file.read(this.data.main);

        // add tests
        main = main.replace('\'{{TESTS}}\'', '[' + tests.join(',') + ']');

        // write main.js
        grunt.file.write(this.data.main, main);
    });

    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-blanket-mocha-badoo');

    // Default task(s).
    grunt.registerTask('default', ['start']);
    grunt.registerTask('start', ['dev', 'http-server', 'watch']);
    grunt.registerTask('dev', [
        'clean:dev',
        'less:dev',
        'copy:dev',
        'copy:tests',
        'tests:prepare'
    ]);

    /**
     * Runs the unit tests against PhantomJS
     *
     * Usage:
     *     $ grunt test:{xunit|spec}
     */
    grunt.registerTask('test', 'Runs the unit tests against PhantomJS', function (format) {

        if (!grunt.file.isDir('build')) {
            grunt.task.run('dev');
        }

        if (!format) {
            format = 'xunit';
        }

        grunt.task.run([
            'blanket_mocha:' + format,
        ]);
    });

};
