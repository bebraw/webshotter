var path = require('path');
var extend = require('util')._extend;

var ProgressBar = require('progress');
var annotate = require('annotate');
var async = require('async');
var im = require('imagemagick');
var is = require('annois');
var mkdirp = require('mkdirp');
var tmp = require('tmp');
var trim = require('trimmer');
var webshot = require('webshot');


module.exports = annotate('webshotter',
    'Captures screenshots based on given `urls` and `outputs`').
    on(validateObject, is.fn, generateShots).
    on(validateObject, is.fn, is.fn, generateShots);

function validateObject(o) {
    return is.object(o) && is.array(o.inputs) && is.array(o.outputs);
}

function generateShots(o, cb, tickCb) {
    tickCb = tickCb || function(err, cb) {
        if(err) return cb(err);

        cb();
    };
    var format = trim.left(o.format, '.');

    async.map(o.inputs, function(input, cb) {
        shoot(extend({
            format: format
        }, input), function(err, d) {
            tickCb(err, function() {
                cb(err, d);
            });
        });
    }, function(err, paths) {
        if(err) return cb(err);

        async.each(paths, function(p, cb) {
            async.each(o.outputs, function(output, cb) {
                mkdirp(output.path, function(err) {
                    if(err) return cb(err);

                    resize({
                        input: p.path,
                        output: path.join(output.path, p.name) + '.' + format,
                        dims: output.dims
                    }, function(err) {
                        tickCb(err, cb);
                    });
                }, cb);
            }, cb);
        });
    });
}

var shoot = annotate('shoot', 'Generates screenshot and returns its name and path to it').
    on(is.object, is.fn, function(o, cb) {
        tmp.file({postfix: '.' + o.format}, function(err, srcPath) {
            if(err) return cb(err);

            webshot(o.url, srcPath, function(err) {
                cb(err, {
                    name: o.name,
                    path: srcPath
                });
            });
        });
    });

var resize = annotate('resize', 'Resizes and outputs images in given paths').
    on(is.object, is.fn, function(o, cb) {
        im.resize({
            srcPath: o.input,
            dstPath: o.output,
            width: o.dims.width,
            height: o.dims.height
        }, cb);
    });

