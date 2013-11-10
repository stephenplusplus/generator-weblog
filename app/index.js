'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var WeblogGenerator = module.exports = function WeblogGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

  this.on('end', function () {
    var howTo
    = '\n'
    + chalk.yellow('\nSweet!') + ' You now have a very pretty blog!'
    + chalk.red('\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-')
    + '\n'
    + '\n  To create a new post, run:'
    + '\n'
    + chalk.cyan('\n    yo weblog:post')
    + '\n'
    + '\n  To see your changes as you make them, kick up a server:'
    + '\n'
    + chalk.cyan('\n    grunt server')
    + '\n'
    + '\n  When you\'re ready to publish your blog, run:'
    + '\n'
    + chalk.cyan('\n    grunt build');

    this.installDependencies({ skipInstall: options['skip-install'] });
  });
};

util.inherits(WeblogGenerator, yeoman.generators.NamedBase);

WeblogGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  this.prompt({
    name: 'blogName',
    message: 'What\'s the name of your blog?'
  }, function (props) {
    this.name = props.blogName;

    cb();
  }.bind(this));
};

WeblogGenerator.prototype.app = function app() {
  // create posts directory, and an initial index.
  this.mkdir('posts');
  this.template('_index.md', 'posts/index.md');

  // create the bower, config, etc json files.
  this.template('_bower.json', 'bower.json');
  this.template('_config.json', 'config.json');
  this.template('_package.json', 'package.json');
  this.copy('_wordmap.json', 'wordmap.json');

  // configuration runtime files.
  this.copy('bowerrc', '.bowerrc');
  this.copy('editorconfig', '.editorconfig');
  this.copy('gitignore', '.gitignore');
  this.copy('jshintrc', '.jshintrc');

  // app files (gruntfile, index.html).
  this.template('Gruntfile.js', 'Gruntfile.js');
  this.template('index.html', 'index.html');
};
