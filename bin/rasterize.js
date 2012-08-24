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
    page.viewportSize = { width: 1024, height: 768 };
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {
            window.setTimeout(function () {
                var clipRect = page.evaluate(function (s) {
                      function hideGovUKBetaOverlayMessage() {
                        $("#popup").hide();
                        $("#mask").hide();
                      }

                      hideGovUKBetaOverlayMessage();
                      return document.querySelector(s).getBoundingClientRect();
                    }, selector);
                page.clipRect = {
                   top:    clipRect.top,
                   left:   clipRect.left,
                   width:  clipRect.width,
                   height: clipRect.height
                  };
                var imageSaved = page.render(output);
                if (!imageSaved) {
                  phantom.exit(2);
                } else {
                  phantom.exit();
                }
            }, 200);
        }
    });
}
