module.exports = function (grunt) {
    'use strict';

    // Project config.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            all: {
                files: {
                    'qwerty-hancock.min.js': 'qwerty-hancock.js'
                },
                options: {
                    banner: '/* <%= pkg.title %> <%= pkg.version %> (c) 2013-14 Stuart Memo */\n'
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma-conf.js'
            }
        }
    });

    // Load plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-karma');

    // Tasks.
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('tests', ['karma']);
};
