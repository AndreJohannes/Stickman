/// <reference path="./node.ts" />
/// <reference path="../visual/primitives/rectangle.ts" />
/// <reference path="./ifigure.ts" />
var Background = (function () {
    function Background(name) {
        this.name = name;
        var root = new Node_(new THREE.Vector2(0, 0));
        var handle = new Node_(60, 0);
        root.addChild(handle);
        handle.addVisual(new Rectangle(), new Rectangle());
        this.root = root;
    }
    Background.prototype.getVisual = function () {
        return this.root.getVisual();
    };
    Background.prototype.getPhantom = function () {
        return this.root.getVisual(true);
    };
    Background.prototype.getRoot = function () {
        return this.root;
    };
    Background.prototype.getName = function () {
        return this.name;
    };
    Background.prototype.serialize = function () {
        var figure = new FigureWrapped();
        figure.name = this.name;
        figure.root = this.root.serialize();
        return figure;
    };
    return Background;
}());
