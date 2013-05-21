'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var WeblogGenerator = module.exports = function WeblogGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

  this.hookFor('weblog:post', {
    args: args
  });

  this.on('end', function () {
    var cb = this.async();

    this.installDependencies();

    var howTo
    = '\nSweet! We\'ve created your blog for you!'
    + '\n'
    + '\nTo create a new post, run:'
    + '\n'
    + '\n  yo weblog:post'.cyan
    + '\n'
    + '\nTo see your changes as you make them, kick up a server:'
    + '\n'
    + '\n  grunt server'.cyan;

    console.log(howTo);
  });
};

util.inherits(WeblogGenerator, yeoman.generators.NamedBase);

WeblogGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcome);

  var prompts = [{
    name: 'blogName',
    message: 'What\'s the name of your blog?'
  }/*, {
    name: 'githubUser',
    message: 'What\'s your GitHub user name?'
  }, {
    name: 'githubRepo',
    message: 'What repo should we use/create?'
  }, {
    name: 'twitter',
    message: 'What\'s your Twitter account?'
  }, {
    name: 'facebook',
    message: 'And your Facebook username?'
  }*/];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.name = props.blogName;

    this.github = {
      user: props.githubUser || '',
      repo: props.githubRepo || ''
    };

    this.twitter = props.twitter || '';
    this.facebook = props.facebook || '';

    cb();
  }.bind(this));
};

WeblogGenerator.prototype.app = function app() {
  this.mkdir('posts');
  this.template('_index.md', 'posts/index.md');

  this.template('_bower.json', 'bower.json');
  this.template('_config.json', 'config.json');
  this.template('_package.json', 'package.json');
  this.copy('_wordmap.json', 'wordmap.json');
};

WeblogGenerator.prototype.projectfile = function projectfile() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('editorconfig', '.editorconfig');
  this.copy('gitignore', '.gitignore');
  this.copy('jshintrc', '.jshintrc');

  this.template('Gruntfile.js', 'Gruntfile.js');
  this.template('index.html', 'index.html');
};
