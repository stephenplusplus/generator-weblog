'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  this.prompt({
    name: 'postTitle',
    message: 'Title?'
  }, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

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
  this.write('posts/' + filename, '## ' + this.postTitle);
};
