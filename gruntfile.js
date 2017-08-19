module.exports = function(grunt) {

  grunt.initConfig({

    clean: {
      dist: {
        src: ['dist']
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          'dist/js/libs.min.js': [
            'libs/jquery-3.2.1.min.js',
            'libs/bootstrap.min.js',
            'libs/angular.min.js',
            'libs/angular-route.min.js',
            'libs/angular-sanitize.min.js',
            'libs/angular-cookies.min.js',
            'libs/angular-locale_pt-br.js'
          ],
          'dist/js/app.min.js': [
            'js/app.js',
            'js/mainController.js',
            'js/genericController.js'
          ]
        }
      }
    },

    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      dist: {
        files: {
          'dist/css/app.min.css': [
            'css/bootstrap.min.css',
            'custom.css'
          ]
        }
      }
    },

    processhtml: {
      options: {
        data: {
        }
      },
      dist: {
        files: {
          'dist/index.html': ['index.html']
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'views',
          src: ['*.html'],
          dest: 'dist/views'
        }]
      }
    },

    copy: {
      dist: {
        files: [
          {expand: true, src: ['img/**'], dest: 'dist/'},
          {expand: true, src: ['fonts/**'], dest: 'dist/'},
        ]
      }
    },

    run: {
      options: {},
      dist: {
        cmd: 'node',
        args: ['servidor.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-run');
  grunt.registerTask("default", [
    'clean:dist',
    'uglify:dist',
    'cssmin:dist',
    'processhtml:dist',
    'htmlmin:dist',
    'copy:dist',
    'run:dist'
  ]);
};
