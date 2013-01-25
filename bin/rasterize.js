var page = require('webpage').create(),
    address, output;

setTimeout(function() {
    phantom.exit(1);
}, 10000);


if (phantom.args.length < 2 || phantom.args.length > 4) {
    console.log('Usage: rasterize.js URL filename selector');
    phantom.exit();
} else {
    address = phantom.args[0];
    output = phantom.args[1];
    selector = phantom.args[2];
    page.viewportSize = { width: 1280, height: 1024 };
    page.open(address, function (status) {

        function hideAnnotationMarkers() {
            $("#inside-gov-weekly-visitors .annotation").hide();
        };

        function getClipRect(selector) {
            return document.querySelector(selector).getBoundingClientRect();
        };

        function exit(success) {
            if (!success) {
                phantom.exit(2);
            } else {
                phantom.exit();
            }
        }

        function base64EncodedFont(filename) {
            var fs = require("fs");
            var fontFile = fs.open("fonts/" + filename, "r");
            var base64EncodedFont = "data:application/octet-stream;base64," + btoa(unescape(encodeURIComponent(fontFile.read())))
        }

        function replace_WOFF_FontsWith_TTF(fontFamily, base64EncodedFont) {
            var style = $("<style> @font-face { font-family: 'nta'; src: url(" + base64EncodedFont + ") format('truetype'); font-weight: normal; font-style: normal; } @font-face { font-family: 'ntatabularnumbers'; src: url(" + base64EncodedFont + ") format('truetype'); font-weight: normal; font-style: normal; }</style>");
            $('html > head').append(style);
        }

        function processPage() {
            page.evaluate(hideAnnotationMarkers);
            replace_WOFF_FontsWith_TTF(base64EncodedFont("nta", "nta.ttf"));
            replace_WOFF_FontsWith_TTF(base64EncodedFont("ntatabularnumbers", "ntatabularnumbers.ttf"));
            page.clipRect = page.evaluate(getClipRect, selector);
            var saved = page.render(output);
            exit(saved);
        };

        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {
            window.setTimeout(processPage, 200);
        }
    });
}
