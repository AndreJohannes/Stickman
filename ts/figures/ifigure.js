/// <reference path="./node.ts" />
var FigureWrapped = (function () {
    function FigureWrapped() {
    }
    return FigureWrapped;
}());
var GenericFigure = (function () {
    function GenericFigure() {
    }
    GenericFigure.prototype.getVisual = function () {
        return this.root.getVisual();
    };
    GenericFigure.prototype.getPhantom = function () {
        return this.root.getVisual(true);
    };
    GenericFigure.prototype.getRoot = function () {
        return this.root;
    };
    GenericFigure.prototype.getName = function () {
        return this.name;
    };
    GenericFigure.prototype.setName = function (name) {
        this.name = name;
    };
    GenericFigure.prototype.serialize = function () {
        var figure = new FigureWrapped();
        figure.name = this.name;
        figure.root = this.root.serialize();
        return figure;
    };
    ;
    GenericFigure.deserialize = function (object) {
        var figure = new GenericFigure();
        figure.name = object["name"];
        figure.root = new Node_(object["root"]);
        return figure;
    };
    return GenericFigure;
}());
var MonadFigure = (function () {
    function MonadFigure(rect) {
        var root = new Node_(new THREE.Vector2(0, 0));
        var monad = new Node_(rect.getLength(), 0);
        root.addChild(monad);
        monad.addVisual(new Rectangle(rect), new Rectangle(rect));
        this.root = root;
        this.name = "Monad";
    }
    MonadFigure.prototype.getVisual = function () {
        return this.root.getVisual();
    };
    MonadFigure.prototype.getPhantom = function () {
        return this.root.getVisual(true);
    };
    MonadFigure.prototype.getRoot = function () {
        return this.root;
    };
    MonadFigure.prototype.getName = function () {
        return this.name;
    };
    MonadFigure.prototype.setName = function (name) {
        this.name = name;
    };
    MonadFigure.prototype.serialize = function () {
        var figure = new FigureWrapped();
        figure.name = this.name;
        figure.root = this.root.serialize();
        return figure;
    };
    ;
    return MonadFigure;
}());
var PivotFigure = (function () {
    function PivotFigure(root) {
        this.root = root;
        this.name = "Pivot";
    }
    PivotFigure.prototype.getVisual = function () {
        return this.root.getVisual();
    };
    PivotFigure.prototype.getPhantom = function () {
        return this.root.getVisual(true);
    };
    PivotFigure.prototype.getRoot = function () {
        return this.root;
    };
    PivotFigure.prototype.getName = function () {
        return this.name;
    };
    PivotFigure.prototype.setName = function (name) {
        this.name = name;
    };
    PivotFigure.prototype.serialize = function () {
        var figure = new FigureWrapped();
        figure.name = this.name;
        figure.root = this.root.serialize();
        return figure;
    };
    ;
    return PivotFigure;
}());
