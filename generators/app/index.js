var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
    promptTask: function () {
        var done = this.async();
        this.prompt({
            type    : 'input',
            name    : 'name',
            message : 'Your project name',
            default : this.appname // Default to current folder name
        }, function (answers) {
            this.log(answers.name);
            done();
        }.bind(this));
    }
});