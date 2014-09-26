var yeoman = require('yeoman-generator');
var Base = yeoman.generators.Base;
var Path = require('path');
module.exports = Base.extend({
    constructor: function () {
        Base.apply(this, arguments);
        this.option('port', { type: Number, defaults: '8000'});
        this.option('version', { type: String, defaults: '1.0.0'});
    },

    welcome: function () {
        this.appname = this.appname.replace(/\s/g, '-');
        this.log('welcome to generator-modulex-core: ' + this.appname);
        this.port = this.options.port;
        this.version = this.options.version;
    },

    setup: function () {
        var self = this;
        this.src.recurse('.', function (path, root, subdir, filename) {
            self.template(path, subdir ? Path.resolve(subdir, filename) : filename);
        });
        this.dest.write('lib/' + this.appname + '.js', ['/**', '*' + this.appname , '*/'].join('\n'));
    },

    done: function () {
        this.log('done');
    }
});