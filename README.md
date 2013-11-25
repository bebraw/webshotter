# webshotter - Capture multiple screenshots per website

`webshotter` allows you to capture multiple screenshots with varying dimensions for given websites and output them to desired location. Example:

```js
var webshotter = require('webshotter');


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
```

In addition it is possible to provide a callback that is called per tick. This allows you to implement things like progress bars easily. See `progress_demo.js` for a concrete example.

## License

`webshotter` is available under MIT. See LICENSE for more details.
