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
    on(function(o) {
        return is.object(o) && is.array(o.urls) && is.array(o.outputs);
    }, is.fn, generateShots);

function generateShots(o, cb) {
    var bar = new ProgressBar(':bar', {
        total: o.urls.length * o.outputs.length
    });

    async.map(o.outputs, function(output, cb) {
        mkdirp(output.path, function(err) {
            if(err) return cb(err);

            async.map(o.urls, function(url, cb) {
                shoot({
                    url: url,
                    output: output.path,
                    dims: output.dims,
                    format: o.format
                }, function(err) {
                    if(err) return cb(err);

                    bar.tick();

                    cb();
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

            webshot(o.url, srcPath, function(err) {
                if(err) return cb(err);

                var dstPath = path.join(o.output, o.url + '.' + o.format);

                im.resize({
                    srcPath: srcPath,
                    dstPath: dstPath,
                    width: o.dims.width,
                    height: o.dims.height
                }, cb);
            });
        });
    });
