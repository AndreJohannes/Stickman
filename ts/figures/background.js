/// <reference path="./articulate.ts" />
/// <reference path="../primitives/rectangle.ts" />
var Background = (function () {
    function Background() {
        var root = new Node_(new THREE.Vector2(0, 0));
        var handle = new Node_(60, 0);
        root.addChild(handle);
        handle.addVisual((new Rectangle()).getObject());
        this.root = root;
    }
    Background.prototype.getObject = function () {
        return this.root.getVisual();
    };
    Background.prototype.getRoot = function () {
        return this.root;
    };
    return Background;
}());
