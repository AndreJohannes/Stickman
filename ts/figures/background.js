/// <reference path="./node.ts" />
/// <reference path="../visual/primitives/rectangle.ts" />
/// <reference path="./ifigure.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Background = (function (_super) {
    __extends(Background, _super);
    function Background(name) {
        _super.call(this);
        this.name = name;
        var root = new Node_(new THREE.Vector2(0, 0));
        var handle = new Node_(60, 3.14159);
        root.addChild(handle);
        //handle.addVisual(new Rectangle(), new Rectangle());
        this.root = root;
    }
    return Background;
}(IFigure));
