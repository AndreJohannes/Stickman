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
