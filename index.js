var path = require('path');

var ProgressBar = require('progress');
var async = require('async');
var im = require('imagemagick');
var mkdirp = require('mkdirp');
var tmp = require('tmp');
var trim = require('trimmer');
var webshot = require('webshot');


module.exports = generateShots;

function generateShots(o, cb) {
    if(!o.urls) return console.warn('Missing urls');
    if(!o.outputs) return console.warn('Missing outputs');

    var bar = new ProgressBar(':bar', {
        total: o.urls.length * o.outputs.length
    });

    async.map(o.outputs, function(output, cb) {
        mkdirp(output.path, function(err) {
            if(err) return cb(err);

            async.map(o.urls, function(url, cb) {
                shot({
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

function shot(o, cb) {
    // TODO: assert that url, output, dims and format have been set
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
}
