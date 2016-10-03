/// <reference path="../definitions/three.d.ts" />
/// <reference path="../primitives/dots.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visual = (function (_super) {
    __extends(Visual, _super);
    function Visual() {
        _super.call(this);
        this.isVisual = true;
        this.dot = new Dot(Color.Blue).getObject();
        this.dot_active = new Dot(Color.Red).getObject();
        this.add(this.dot);
        this.add(this.dot_active);
    }
    Visual.prototype.activate = function () {
        this.dot_active.visible = true;
    };
    Visual.prototype.deactivate = function () {
        this.dot_active.visible = false;
    };
    Visual.prototype.setDotPosition = function (x, y) {
        this.dot.position.set(x, y, 0);
        this.dot_active.position.set(x, y, 0);
    };
    Visual.prototype.rotate = function (x) {
        this.rotation.set(0, 0, x);
    };
    return Visual;
}(THREE.Object3D));
