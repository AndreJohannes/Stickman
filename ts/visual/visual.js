/// <reference path="../definitions/three.d.ts" />
/// <reference path="../visual/dots.ts" />
/// <reference path="./primitives/factory.ts" />
/// <reference path="../figures/node.ts" />
var Visual = (function () {
    function Visual() {
        this.isVisual = true;
        this.mode = NodeMode.Edit;
        this.primary = new THREE.Object3D();
        this.secondary = new THREE.Object3D();
        this.dot = new Dot(Color.Blue).getObject();
        this.dot_active = new Dot(Color.Red).getObject();
        this.primary.add(this.dot);
        this.primary.add(this.dot_active);
    }
    Visual.prototype.setMode = function (mode) {
        switch (mode) {
            case NodeMode.Play:
                this.secondary.visible = false;
                this.primary.visible = true;
                this.dot.visible = false;
                this.dot_active.visible = false;
                break;
            case NodeMode.Edit:
                this.secondary.visible = true;
                this.primary.visible = true;
                this.dot.visible = true;
                this.dot_active.visible = false;
                break;
        }
    };
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
    Visual.prototype.getSecondary = function () {
        return this.secondary;
    };
    Visual.prototype.showSecondary = function (show) {
        this.secondary.visible = show;
    };
    Visual.prototype.add = function (visual) {
        this.primary.add(visual.primary);
        this.secondary.add(visual.secondary);
    };
    Visual.prototype.addPrimary = function (object) {
        this.primary.add(object.getObject());
        this.primaryPrimitive = object;
    };
    Visual.prototype.addSecondary = function (object) {
        this.secondary.add(object.getObject());
        this.secondaryPrimitive = object;
    };
    Visual.prototype.serialize = function () {
        return {
            "primary": this.primaryPrimitive != null ? this.primaryPrimitive.serialize() : null,
            "secondary": this.secondaryPrimitive != null ? this.secondaryPrimitive.serialize() : null
        };
    };
    Visual.deserialize = function (object) {
        var retObject = new Visual();
        if (object["primary"] != null)
            retObject.addPrimary(Primitives.getPrimitive(object["primary"]["name"], object["primary"]));
        if (object["secondary"] != null)
            retObject.addSecondary(Primitives.getPrimitive(object["secondary"]["name"], object["secondary"]));
        return retObject;
    };
    return Visual;
}());
