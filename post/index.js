'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'postName',
    message: 'What do you want to call this post?'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.postName = props.postName;

    cb();
  }.bind(this));
};

Generator.prototype.createFiles = function createFiles() {
  var today = new Date();

  var prefix = today.getUTCMonth() + 1;
  prefix += '-' + today.getDate();
  prefix += '-' + today.getFullYear();

  var filename = prefix + '-' + this._.slugify(this.postName) + '.md';
  this.write('posts/' + filename, '## ' + this.postName);
};
