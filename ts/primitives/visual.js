/// <reference path="../definitions/three.d.ts" />
/// <reference path="../primitives/dots.ts" />
var Visual = (function () {
    function Visual() {
        this.isVisual = true;
        this.primary = new THREE.Object3D();
        this.secondary = new THREE.Object3D();
        this.dot = new Dot(Color.Blue).getObject();
        this.dot_active = new Dot(Color.Red).getObject();
        this.primary.add(this.dot);
        this.primary.add(this.dot_active);
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
    Visual.prototype.rotate = function (x, secondary) {
        if (secondary)
            this.secondary.rotation.set(0, 0, x);
        else
            this.primary.rotation.set(0, 0, x);
    };
    Visual.prototype.position = function (x, y, secondary) {
        if (secondary)
            this.secondary.position.set(x, y, 0);
        else
            this.primary.position.set(x, y, 0);
    };
    Visual.prototype.getPrimary = function () {
        return this.primary;
    };
    Visual.prototype.add = function (visual) {
        this.primary.add(visual.primary);
        this.secondary.add(visual.secondary);
    };
    Visual.prototype.addPrimary = function (object) {
        this.primary.add(object);
    };
    Visual.prototype.addSecondary = function (object) {
        this.secondary.add(object);
    };
    return Visual;
}());
