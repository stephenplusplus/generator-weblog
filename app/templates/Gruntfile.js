// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },
      livereload: {
        files: [
          'index.html',
          'posts/*.md'
        ],
        tasks: ['build']
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>'
      }
    }
  });

  grunt.registerTask('server', ['build', 'connect:livereload', 'open', 'watch']);

  grunt.registerTask('build', function () {
    var words = [];

    grunt.file.recurse('posts', function (post, root, sub, fileName) {
      words.push('id:' + fileName.replace('.md', ''));

      post = grunt.file.read(post)
        .replace(/[\W]/gm, ' ')
        .replace(/\s+/gm, ' ')
        .trim()
        .split(' ');

      words.push(post);
    });

    words = grunt.util._.flatten(words);

    grunt.file.write('wordmap.json', JSON.stringify(words));
  });
};
