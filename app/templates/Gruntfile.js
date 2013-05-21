// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';
var moment = require('moment');

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

  grunt.registerTask('build', 'Build your blog.', function () {
    var words = [];
    var posts = [];
    var unslug = function (slug) {
      return slug.replace(/(-(\w))/g, function () { return ' ' + arguments[2].toUpperCase(); });
    };

    grunt.file.recurse('posts', function (post, root, sub, fileName) {
      if (fileName === 'index.md') {
        return;
      }

      posts.push(fileName.replace('.md', ''));
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
    grunt.file.write('posts/index.md', function () {
      var file = '# ' + grunt.file.readJSON('config.json').name + '\n';
      var lastDate;

      posts.reverse().forEach(function (post) {
        var postDate = post.replace(/((\d*-\d*-\d*).*)/, '$2');
        var title = post.replace(postDate, '').replace(/\s+/g, ' ').trim();

        if (lastDate !== postDate) {
          file += '\n### ' + moment(postDate).format('dddd, MMMM Do, YYYY');
        }

        file += '\n#### [' + postDate + ' -' + unslug(title) + '](#' + postDate + title + ')';

        lastDate = postDate;
      });

      return file.trim();
    }());
  });
};
