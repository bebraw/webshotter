var path = require('path');

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

    async.map(o.outputs, function(output, cb) {
        mkdirp(output.path, function(err) {
            if(err) return cb(err);

            async.map(o.inputs, function(input, cb) {
                shoot({
                    input: input,
                    output: output.path,
                    dims: output.dims,
                    format: o.format
                }, function(err) {
                    tickCb(err, cb);
                });
            }, cb);
        });
    }, cb);
}

var shoot = annotate('shoot', 'Captures and resizes').
    on(is.object, is.fn, function shot(o, cb) {
        o.format = trim.left(o.format, '.');

        tmp.file({postfix: '.' + o.format}, function(err, srcPath) {
            if(err) return cb(err);

            webshot(o.input.url, srcPath, function(err) {
                if(err) return cb(err);

                var dstPath = path.join(o.output, o.input.name + '.' + o.format);

                im.resize({
                    srcPath: srcPath,
                    dstPath: dstPath,
                    width: o.dims.width,
                    height: o.dims.height
                }, cb);
            });
        });
    });
