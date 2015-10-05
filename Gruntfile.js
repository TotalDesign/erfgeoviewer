'use strict';
//var lrSnippet = require( 'grunt-contrib-livereload/lib/utils' ).livereloadSnippet;
var mountFolder = function( connect, dir ) {
  return connect.static( require( 'path' ).resolve( dir ) );
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function( grunt ) {
  // load all grunt tasks
  require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );
  // show elapsed time at the end
  require( 'time-grunt' )( grunt );

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig( {
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
      /* not used at the moment
       handlebars: {
       files: [
       '<%= yeoman.app %>/templates/*.hbs'
       ],
       tasks: ['handlebars']
       }*/
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
      dev: {
        src: 'app/templates/index.html',
        dest: 'app/index.html'
      },
      prod: {
        src: 'app/templates/index.html',
        dest: '<%= yeoman.dist %>/index.html'
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
        reporter: require( 'jshint-stylish' )
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
      dist: {
        // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
        options: {
          // `name` and `out` is set by grunt-usemin
          baseUrl: 'app/scripts',
          optimize: 'none',
          paths: {
            'templates': '../../.tmp/scripts/templates',
            'config': 'config/acc'
          },
          // TODO: Figure out how to make sourcemaps work with grunt-usemin
          // https://github.com/yeoman/grunt-usemin/issues/30
          //generateSourceMaps: true,
          // required to support SourceMaps
          // http://requirejs.org/docs/errors.html#sourcemapcomments
          preserveLicenseComments: false,
          useStrict: true,
          wrap: true,
          mainConfigFile: 'app/scripts/require-config.js',

          // TODO: split for two different builds
          name: 'erfgeoviewer.mapmaker'
        }
      }
    },

    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
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
      dist: {
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

    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
           // https://github.com/yeoman/grunt-usemin/issues/44
           //collapseWhitespace: true,
           collapseBooleanAttributes: true,
           removeAttributeQuotes: true,
           removeRedundantAttributes: true,
           useShortDoctype: true,
           removeEmptyAttributes: true,
           removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
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
            'app/styles/images/**',
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
    },

    // handlebars
    handlebars: {
      compile: {
        options: {
          namespace: 'JST',
          amd: true
        },
        files: {
          '.tmp/scripts/templates.js': ['templates/**/*.hbs']
        }
      }
    }
  } );

  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.registerTask( 'createDefaultTemplate', function() {
    grunt.file.write( '.tmp/scripts/templates.js', 'this.JST = this.JST || {};' );
  } );

  grunt.registerTask( 'registerPlugins', function() {
    var find = require('find'),
      fs = require('fs'),
      path = require('path'),
      util = require('util'),
      done = this.async(),
      pluginDir = yeomanConfig.app + '/scripts/plugins',
      outDir = yeomanConfig.dist + '/scripts/plugin';

    var inspect = function (obj) {
      return util.inspect(obj, false, 4, true);
    };

    find.file(/^erfgeo-grunt-require\.json$/, pluginDir, function(files) {
      files.forEach(function(file) {
        var baseUrl = path.dirname(file),
          pluginName = path.basename(baseUrl),
          requirejsConfig = JSON.parse(fs.readFileSync(file, 'utf8'));

        requirejsConfig.options.baseUrl = 'app/scripts';
        requirejsConfig.options.out = path.join(outDir, pluginName + '.js');

        grunt.log.subhead('Register plugin:')
          .subhead('  ' + pluginName + ':')
          .writeln('  ' + inspect(requirejsConfig));

        grunt.config.set('requirejs.' + pluginName, requirejsConfig)

      });
      done();
    });
  });

  // starts express server with live testing via testserver
  grunt.registerTask( 'default', function( target ) {

    // what is this??
    if ( target === 'dist' ) {
      return grunt.task.run( ['build', 'open', 'connect:dist:keepalive'] );
    }

    grunt.option( 'force', true );

    grunt.task.run( [
      'clean:server',
      'compass:server',
      'env:dev',
      'preprocess:dev',
      'connect:testserver',
      'express:dev',
      //'exec',
      //'open',
      'watch'
    ] );
  } );

  // todo fix these
  grunt.registerTask( 'test', [
    'clean:server',
    'createDefaultTemplate',
    'handlebars',
    'compass',
    'connect:testserver',
    'exec:mocha'
  ] );

  grunt.registerTask( 'build', [
    'createDefaultTemplate',
    'clean:dist',
    'env:prod',
    'compass:dist',
    'useminPrepare',
    'registerPlugins',
    'requirejs',
    'imagemin',
    'htmlmin',
    'concat',
    'cssmin',
    //'uglify',
    'preprocess:prod',
    'usemin',
    'copy'
  ] );

};
