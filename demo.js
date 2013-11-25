#!/usr/bin/env node
var webshotter = require('./index');


main();

function main() {
    var urls = ['google.com', 'yahoo.com'];
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

    webshotter({
        urls: urls,
        outputs: outputs,
        format: 'jpg'
    }, function(err) {
        if(err) return console.error(err);

        console.log('done');
    });
}
