var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.geometry = function () {
    function CollisionBox(rectangle) {
        this.top = rectangle.y;
        this.bottom = rectangle.y + rectangle.height;
        this.left = rectangle.x;
        this.right = rectangle.x + rectangle.width;
        this.center = {
            x: rectangle.x + (rectangle.width / 2),
            y: rectangle.y + (rectangle.height / 2)
        };
    }

    CollisionBox.prototype.collidesWith = function (box) {
        if (this.bottom < box.top) return false;
        if (this.top > box.bottom) return false;
        if (this.left > box.right) return false;
        if (this.right < box.left) return false;
        return true;
    };

    CollisionBox.prototype.outsideOf = function (box) {
        if (this.right > box.right) return true;
        if (this.left < box.left) return true;
        if (this.top < box.top) return true;
        if (this.bottom > box.bottom) return true;
        return false;
    };

    CollisionBox.prototype.extendBy = function (value) {
        this.bottom += value;
        this.top -= value;
        this.left -= value;
        this.right += value;
    };

    return {
        CollisionBox: CollisionBox
    };
}();