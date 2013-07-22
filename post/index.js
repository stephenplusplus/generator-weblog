'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

module.exports = Generator;

function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  if (typeof args[0] === 'string') {
    this.postTitle = args[0];
  }
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askFor = function askFor() {
  if (this.postTitle) {
    return;
  }

  var cb = this.async();

  this.prompt({
    name: 'postTitle',
    message: 'Title?'
  }, function (props) {
    this.postTitle = props.postTitle;

    cb();
  }.bind(this));
};

Generator.prototype.createFiles = function createFiles() {
  var today = new Date();

  var prefix = today.getUTCMonth() + 1;
  prefix += '-' + today.getDate();
  prefix += '-' + today.getFullYear();

  var filename = prefix + '-' + this._.slugify(this.postTitle) + '.md';
  this.write('posts/' + filename, '# ' + this.postTitle);
};
