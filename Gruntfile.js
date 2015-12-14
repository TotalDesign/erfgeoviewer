'use strict';
//var lrSnippet = require( 'grunt-contrib-livereload/lib/utils' ).livereloadSnippet;
var mountFolder = function( connect, dir ) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function( grunt ) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // show elapsed time at the end
  require('time-grunt')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,

    // watch list
    watch: {

      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },

      livereload: {
        files: [

          '<%= yeoman.app %>/*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,**/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,**/}*.js',
          '{.tmp,<%= yeoman.app %>}/templates/{,**/}*.hbs',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',

          'test/spec/{,**/}*.js'
        ],
        //tasks: ['exec'],
        options: {
          livereload: true
        }
      }

    },

    // testing server
    connect: {
      testserver: {
        options: {
          port: 1234,
          base: '.'
        }
      }
    },

    // mocha command
    exec: {
      mocha: {
        command: 'mocha-phantomjs http://localhost:<%= connect.testserver.options.port %>/test',
        stdout: true
      }
    },

    // express app
    express: {
      options: {
        // Override defaults here
        port: '9009'
      },
      dev: {
        options: {
          script: 'server/app.js'
        }
      },
      prod: {
        options: {
          script: 'server/app.js'
        }
      }
    },

    env: {
      options: {
        /* Shared Options Hash */
        //globalOption : 'foo'
      },
      dev: {
        NODE_ENV: 'DEVELOPMENT'
      },
      prod: {
        NODE_ENV: 'PRODUCTION'
      }
    },

    preprocess: {
      mapmaker: {
        src: 'app/templates/index-mapmaker.html',
        dest: '<%= yeoman.dist %>/mapmaker.html'
      },
      reader: {
        src: 'app/templates/index-reader.html',
        dest: '<%= yeoman.dist %>/reader.html'
      }
    },

    // open app and test page
    open: {
      server: {
        path: 'http://localhost:<%= express.options.port %>'
      }
    },

    clean: {
      dist: ['.tmp', '<%= yeoman.dist %>/*'],
      server: '.tmp'
    },

    // linting
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // deployment to test environment
    'sftp-deploy': {
      build: {
        auth: {
          host: 'erfgeo.acc.totalactivemedia.nl',
          port: 22,
          authKey: 'privateKey'
        },
        cache: 'deployment-cache.json',
        src: '/Users/jasony/livereload/erfgeoviewer/dist',
        dest: '/home/erfgeo/public_html',
        exclusions: ['/path/to/source/folder/**/.DS_Store', '/path/to/source/folder/**/Thumbs.db', 'dist/tmp'],
        serverSep: '/',
        concurrency: 4,
        progress: true
      }
    },

    // compass
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: 'app/bower_components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // require
    requirejs: {
      mapmaker: {
        // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
        options: {
          baseUrl: 'app/scripts',
          mainConfigFile: 'app/scripts/build/erfgeoviewer.mapmaker.build.js',
          name: 'erfgeoviewer.mapmaker',
          optimize: 'uglify',
          out: '<%= yeoman.dist %>/scripts/erfgeoviewer.mapmaker.js',
          preserveLicenseComments: false,
          useStrict: true,
          wrap: true
        }
      },
      reader: {
        options: {
          baseUrl: 'app/scripts',
          mainConfigFile: 'app/scripts/build/erfgeoviewer.reader.build.js',
          name: 'erfgeoviewer.reader',
          optimize: 'uglify',
          out: '<%= yeoman.dist %>/scripts/erfgeoviewer.reader.js',
          preserveLicenseComments: false,
          useStrict: true,
          wrap: true
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    cssmin: {
      generated: {
        files: [
          {
            dest: '<%= yeoman.dist %>/styles/main.css',
            src: [
              '.tmp/styles/main.css',
              'app/styles/{,*/}*.css'
            ]
          },
          {
            dest: '<%= yeoman.dist %>/styles/admin.css',
            src: [
              '.tmp/styles/admin.css'
            ]
          }
        ]
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'scripts/config/acc.js',
            'images/{,*/}*.{webp,gif}',
            'styles/images/**',
            'bower_components/requirejs/require.js',
            'font/**'
          ]
        }]
      }
    },

    bower: {
      all: {
        rjsConfig: '<%= yeoman.app %>/scripts/main.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.registerTask('createDefaultTemplate', function() {
    grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
  });

  grunt.registerTask('registerPlugins', function() {
    var find      = require('find'),
        fs        = require('fs'),
        path      = require('path'),
        util      = require('util'),
        done      = this.async(),
        pluginDir = yeomanConfig.app + '/scripts/plugins',
        outDir    = yeomanConfig.dist + '/scripts/plugin';

    var inspect = function( obj ) {
      return util.inspect(obj, false, 4, true);
    };

    find.file(/^erfgeo-grunt-require\.json$/, pluginDir, function( files ) {
      files.forEach(function( file ) {
        var baseUrl         = path.dirname(file),
            pluginName      = path.basename(baseUrl),
            requirejsConfig = JSON.parse(fs.readFileSync(file, 'utf8'));

        requirejsConfig.options.baseUrl = 'app/scripts';
        requirejsConfig.options.out     = path.join(outDir, pluginName + '.js');

        grunt.log.subhead('Register plugin:')
          .subhead('  ' + pluginName + ':')
          .writeln('  ' + inspect(requirejsConfig));

        grunt.config.set('requirejs.' + pluginName, requirejsConfig)

      });
      done();
    });
  });

  // starts express server with live testing via testserver
  grunt.registerTask('default', function( target ) {

    // what is this??
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.option('force', true);

    grunt.task.run([
      'clean:server',
      'compass:server',
      'env:dev',
      'preprocess:dev',
      'connect:testserver',
      'express:dev',
      //'exec',
      //'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', function() {

    //var buildMode = grunt.option('build') || 'mapmaker';

    grunt.task.run([
      'createDefaultTemplate',
      'clean:dist',
      'env:prod',
      'compass:dist',
      'registerPlugins',
      'requirejs',//:' + buildMode,
      'imagemin',
      //'concat:generated',
      'cssmin:generated',
      //'uglify',
      'preprocess', // :' + buildMode,
      'copy'
    ]);

  });

};
