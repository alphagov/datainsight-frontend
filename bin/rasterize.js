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
    page.onConsoleMessage = function(msg, line, source) {
      console.log('page logs ' + source + ':' + line + ' - ' + msg);
    };
    page.open(address, function (status) {

        function hideAnnotationMarkers() {
            $("#inside-gov-weekly-visitors .annotation").hide();
        };

        function base64EncodeFont(filename) {
            var fs = require("fs"),
                fontFile = fs.open("fonts/" + filename, "rb");

            return "data:application/octet-stream;base64," + btoa(fontFile.read());
        }


        function updateFonts(fonts) {
          function createFontFaceStyle(fontFamily, fontData) {
            return '@font-face { font-family: "' + fontFamily + '"; src: url(' + fontData + ') format("truetype"); font-weight: normal; font-style: normal; }';
          }

          var style = "<style>" + createFontFaceStyle("nta", fonts["nta"]) + " " + createFontFaceStyle("ntatabularnumbers", fonts["ntatabularnumbers"]) +  "</style>";
          $("html > head").append($(style));
        }

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

        function processPage() {
            page.clipRect = page.evaluate(getClipRect, selector);
            var saved = page.render(output);
            exit(saved);
        };

        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {
            var fonts = {
              "nta":               base64EncodeFont("GDSTransportWebsite.ttf"),
              "ntatabularnumbers": base64EncodeFont("GDSTransportWebsite.ttf")
            };
            page.evaluate(hideAnnotationMarkers);
            page.evaluate(updateFonts, fonts);
            window.setTimeout(processPage, 2000);
        }
    });
}
