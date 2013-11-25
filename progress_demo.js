#!/usr/bin/env node
var ProgressBar = require('progress');

var webshotter = require('./index');


main();

function main() {
    var inputs = [{
            name: 'google',
            url: 'google.com'
        },
        {
            name: 'yahoo',
            url: 'yahoo.com'
        }
    ];
    var outputs = [
        {
            path: 'output/regular',
            dims: {
                width: 300,
                height: 300
            }
        },
        {
            path: 'output/thumbs',
            dims: {
                width: 150,
                height: 100
            }
        }
    ];
    var bar = new ProgressBar(':bar', {
        total: inputs.length + inputs.length * outputs.length
    });

    webshotter({
        inputs: inputs,
        outputs: outputs,
        format: 'jpg'
    }, function(err) {
        if(err) return console.error(err);

        console.log('done');
    }, function(err, cb) { // optional tick
        if(err) return cb(err);

        bar.tick();

        cb();
    });
}
