#!/usr/bin/env node --harmony

var gutil = require('gulp-util');
var koa = require('koa');
var koaBody = require('koa-body');
var path = require('path');
var koaJscover = require('koa-node-jscover');
var jscoverCoveralls = require('node-jscover-coveralls/lib/koa');
var serve = require('koa-static');
var app = koa();
var mount = require('koa-mount');
var cwd = process.cwd();
var serveIndex = require('koa-serve-index');
var modularize = require('koa-modularize');

// parse application/x-www-form-urlencoded
app.use(koaBody({formidable: {uploadDir: __dirname}, multipart: true}));
app.use(koaJscover({
    jscover:require('node-jscover'),
    next:function(){
        return 1;
    }
}));
app.use(function *(next) {
    if (path.extname(this.path) === '.jss') {
        var func = require(path.resolve(__dirname, this.path.substring(1))).call(this);
        yield *func;
    } else {
        yield *next;
    }
});
app.use(mount('/lib/', modularize(path.resolve(__dirname,'lib'))));
app.use(mount('/tests/browser/specs/',modularize(path.resolve(__dirname,'tests/browser/specs/'))));
app.use(jscoverCoveralls());
app.use(serveIndex(cwd, {
    hidden: true,
    view: 'details'
}));
app.use(serve(cwd, {
    hidden: true
}));
var port = process.env.PORT || parseInt('<%= port%>', 10);
app.listen(port);
gutil.log('server start at ' + port);