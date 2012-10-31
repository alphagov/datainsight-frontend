var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.forcePosition = function () {

    var CollisionBox = GOVUK.Insights.geometry.CollisionBox;

    var constants = {};
    constants.FIXED_ELEMENT_CLASS = "js-fixed";
    constants.FLOATING_ELEMENT_CLASS = "js-floating";

    var privateConstants = {};
    privateConstants.REPULSION_STRENGTH = 20;
    privateConstants.ITERATIONS = 10;

    var getTranslatedGraphArea = function (svg, element) {
        var matrix = element.getTransformToElement(element);
        return {
            top:0,
            bottom:parseFloat(svg.attr('height') - matrix.f),
            right:parseFloat(svg.attr('width') - matrix.e),
            left:0
        };
    };

    var anIteration = function (fixedElements, floatingElements, selector) {
        for (var i = 0; i < floatingElements.length; i++) {
            for (var j = i + 1; j < floatingElements.length; j++) {
                var box1 = new CollisionBox(floatingElements[i].getBBox());
                var box2 = new CollisionBox(floatingElements[j].getBBox());
                if (box1.collidesWith(box2)) {
                    equalRepulsion(d3.select(floatingElements[i]), d3.select(floatingElements[j]));
                }
            }
        }

        for (var i = 0; i < floatingElements.length; i++) {
            for (var j = 0; j < fixedElements.length; j++) {
                var floatingBox = new CollisionBox(floatingElements[i].getBBox());

                if (fixedElements[j].nodeName === "path") {
                    for (var k = 0; k < fixedElements[j].pathSegList.numberOfItems; k++) {
                        var item = fixedElements[j].pathSegList.getItem(k);
                        if (floatingBox.containsPoint(item)) {
                            oneWayRepulsion(item.x, item.y, d3.select(floatingElements[i]));
                        }
                    }
                } else {
                    var fixedBox = new CollisionBox(fixedElements[j].getBBox());

                    if (floatingBox.collidesWith(fixedBox)) {
                        var circle = d3.select(fixedElements[j]);
                        var cx = parseFloat(circle.attr('cx'));
                        var cy = parseFloat(circle.attr('cy'));
                        oneWayRepulsion(cx, cy, d3.select(floatingElements[i]));
                    }
                }
            }
        }

        for (var i = 0; i < floatingElements.length; i++) {
            var collisionBox = new CollisionBox(floatingElements[i].getBBox());
            var graphArea = getTranslatedGraphArea(d3.select(selector).select('.js-graph-area'), floatingElements[i]);
            if (collisionBox.outsideOf(graphArea)) {
                pullToCenter(graphArea.right / 2, graphArea.bottom / 2, d3.select(floatingElements[i]));
            }
        }
    };

    var apply = function (selector) {
        var fixedElements = d3.select(selector).selectAll('.' + constants.FIXED_ELEMENT_CLASS)[0];
        var floatingElements = d3.select(selector).selectAll('.' + constants.FLOATING_ELEMENT_CLASS)[0];


        for (var i = 0; i < privateConstants.ITERATIONS; i++) {
            anIteration(fixedElements, floatingElements, selector);
        }
    };

    var equalRepulsion = function (anElement, anotherElement) {
        var dX = parseFloat(anElement.attr('x')) - parseFloat(anotherElement.attr('x')),
            dY = parseFloat(anElement.attr('y')) - parseFloat(anotherElement.attr('y')),
            theta = Math.atan2(dY, dX),
            xMovement = 0.5 * (privateConstants.REPULSION_STRENGTH * Math.cos(theta)),
            yMovement = 0.5 * (privateConstants.REPULSION_STRENGTH * Math.sin(theta));

        moveElement(anElement, xMovement, yMovement);
        moveElement(anotherElement, -1 * xMovement, -1 * yMovement);
    };

    var radsToQuadrant = function (theta) {
        return quadrantFloat = parseFloat(theta / (Math.PI / 2));
    };

    var oneWayRepulsion = function (x, y, anElementThatGetsPushed) {
        var dX = parseFloat(anElementThatGetsPushed.attr('x')) - x,
            dY = parseFloat(anElementThatGetsPushed.attr('y')) - y,
            theta = Math.atan2(dY, dX),
            xMovement = (privateConstants.REPULSION_STRENGTH * Math.cos(theta)),
            yMovement = (privateConstants.REPULSION_STRENGTH * Math.sin(theta));

        moveElement(anElementThatGetsPushed, xMovement, yMovement);
        anElementThatGetsPushed.attr('data-quadrant', radsToQuadrant(theta));
    };

    var pullToCenter = function (centerX, centerY, anElement) {
        var dX = centerX - parseFloat(anElement.attr('x')),
            dY = centerY - parseFloat(anElement.attr('y')),
            theta = Math.atan2(dY, dX),
            xMovement = (privateConstants.REPULSION_STRENGTH * Math.cos(theta)),
            yMovement = (privateConstants.REPULSION_STRENGTH * Math.sin(theta));

        moveElement(anElement, xMovement, yMovement);
    };

    var moveElement = function (element, x, y) {
        var currentX = parseFloat(element.attr('x')),
            currentY = parseFloat(element.attr('y'));

        element.attr('x', currentX + x);
        element.attr('y', currentY + y);
    };

    return {
        apply:apply,
        constants:constants
    };
}();
