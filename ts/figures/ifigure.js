/// <reference path="./node.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FigureWrapped = (function () {
    function FigureWrapped() {
    }
    return FigureWrapped;
}());
var IFigure = (function () {
    function IFigure() {
    }
    IFigure.prototype.getVisual = function () {
        return this.root.getVisual();
    };
    IFigure.prototype.getPhantom = function () {
        return this.root.getVisual(true);
    };
    IFigure.prototype.getRoot = function () {
        return this.root;
    };
    IFigure.prototype.getName = function () {
        return this.name;
    };
    IFigure.prototype.setName = function (name) {
        this.name = name;
    };
    IFigure.prototype.copyFigure = function () {
        var figure = new IFigure();
        figure.name = this.name + "_Copy";
        figure.root = this.root.copy();
        return figure;
    };
    IFigure.prototype.serialize = function () {
        var figure = new FigureWrapped();
        figure.name = this.name;
        figure.root = this.root.serialize();
        return figure;
    };
    ;
    IFigure.deserialize = function (object) {
        var figure = new IFigure();
        figure.name = object["name"];
        figure.root = new Node_(object["root"]);
        return figure;
    };
    return IFigure;
}());
var MonadFigure = (function (_super) {
    __extends(MonadFigure, _super);
    function MonadFigure(rect) {
        _super.call(this);
        var root = new Node_(new THREE.Vector2(0, 0));
        var monad = new Node_(rect.getLength(), 0);
        root.addChild(monad);
        monad.addVisual(new Rectangle(rect), new Rectangle(rect));
        this.root = root;
        this.name = "Monad";
    }
    return MonadFigure;
}(IFigure));
;
var PivotFigure = (function (_super) {
    __extends(PivotFigure, _super);
    function PivotFigure(root) {
        _super.call(this);
        this.root = root;
        this.name = "Pivot";
    }
    return PivotFigure;
}(IFigure));
