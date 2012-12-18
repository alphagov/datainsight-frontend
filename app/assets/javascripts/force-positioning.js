var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.forcePosition = function () {

    var CollisionBox = GOVUK.Insights.geometry.CollisionBox;

    var constants = {};
    constants.FIXED_ELEMENT_CLASS = "js-fixed";
    constants.FLOATING_ELEMENT_CLASS = "js-floating";

    var privateConstants = {};
    privateConstants.REPULSION_STRENGTH = 2;
    privateConstants.ITERATIONS = 50;

    var getTranslatedGraphArea = function (svg, element) {
        var matrix = element.getTransformToElement(element);
        return {
            top:0,
            bottom:parseFloat(svg.attr('height') - matrix.f),
            right:parseFloat(svg.attr('width') - matrix.e),
            left:0
        };
    };

    var getCircleCollisionBox = function(element) {
        var boundingBox = element.getBBox();
        var fixedBox = new CollisionBox(boundingBox);
        var adjustment = 2;
        fixedBox.extendBy(adjustment);
        return fixedBox;
    }

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
                var fixedBox = getCircleCollisionBox(fixedElements[j]);
                if (floatingBox.collidesWith(fixedBox)) {
                    oneWayRepulsion(d3.select(fixedElements[j]), d3.select(floatingElements[i]));
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

    var drawCircleCollisionBox = function(element) {
        var collisionBox = getCircleCollisionBox(element);
        d3.select(element.parentNode)
            .append("svg:rect")
            .attr("width",collisionBox.right - collisionBox.left)
            .attr("height",collisionBox.bottom - collisionBox.top)
            .attr("stroke","black")
            .attr("stroke-width", 1)
            .attr("fill","none")
            .attr("x", collisionBox.left)
            .attr("y", collisionBox.top);
    };

    var apply = function (selector) {
        var chart = d3.select(selector);
        var fixedElements = chart.selectAll('.' + constants.FIXED_ELEMENT_CLASS)[0];
        var floatingElements = chart.selectAll('.' + constants.FLOATING_ELEMENT_CLASS)[0];

        // Add class 'debug' to chart container to enable drawing of bounding boxes
        if (chart.classed("debug")) {
            fixedElements.forEach(drawCircleCollisionBox);
        }

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

    var oneWayRepulsion = function (anElement, anElementThatGetsPushed) {
        var dX = parseFloat(anElementThatGetsPushed.attr('x')) - parseFloat(anElement.attr('cx')),
            dY = parseFloat(anElementThatGetsPushed.attr('y')) - parseFloat(anElement.attr('cy')),
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

        if (element.classed("debug")) {
            console.log([element.attr('id'), currentX, currentY, x, y].join(", "));
        }

        element.attr('x', currentX + x);
        element.attr('y', currentY + y);
    };

    return {
        apply:apply,
        constants:constants
    };
}();
