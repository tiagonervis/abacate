module.exports = function(grunt) {

  //Obtem o parametro urlbase
  var url_base = grunt.option('urlbase') || '/';

  //Configuracao do grunt
  grunt.initConfig({

    //Apaga a pasta dist
    clean: {
      dist: {
        src: ['dist']
      }
    },

    //Minifica arquivos js
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
            'libs/angular-animate.min.js',
            'libs/angular-cookies.min.js',
            'libs/angular-locale_pt-br.js',
            'libs/angular-input-masks-standalone.min.js'
          ],
          'dist/js/app.min.js': [
            'js/app.js',
            'js/upload.js',
            'js/mainController.js',
            'js/genericController.js'
          ]
        }
      }
    },

    //Concatena css
    concat_css: {
      all: {
        src: ['css/bootstrap.min.css', 'css/custom.css'],
        dest: 'dist/css/app.min.css'
      }
    },

    //Processa tags no html da index
    processhtml: {
      options: {
        data: {
          urlbase: url_base
        }
      },
      dist: {
        files: {
          'dist/index.html': ['index.html']
        }
      }
    },

    //Minifica html
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

    //Copia arquivos estaticos
    copy: {
      dist: {
        files: [
          {expand: true, src: ['img/**'], dest: 'dist/'},
          {expand: true, src: ['fonts/**'], dest: 'dist/'},
          {expand: true, src: ['models/**'], dest: 'dist/'},
          {expand: true, src: ['manifest.json'], dest: 'dist/'}
        ]
      }
    },

    //Executa servidor na pasta dist
    run: {
      options: {},
      dist: {
        cmd: 'node',
        args: ['express.js']
      }
    }
  });

  //Define modulos do grunt
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-run');

  //Configura sequencia de execucao
  grunt.registerTask("default", [
    'clean:dist',
    'uglify:dist',
    'concat_css',
    'processhtml:dist',
    'htmlmin:dist',
    'copy:dist',
    'run:dist'
  ]);
};
