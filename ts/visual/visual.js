/// <reference path="../definitions/three.d.ts" />
/// <reference path="../visual/dots.ts" />
/// <reference path="./primitives/factory.ts" />
/// <reference path="../figures/node.ts" />
/// <reference path="../visual/primitives/link.ts" />
var VElement = (function () {
    function VElement(length, phantom) {
        this.principal = new THREE.Object3D();
        this.offset = new THREE.Object3D();
        this.primitive = new THREE.Object3D();
        this.link = new VLink(length, phantom);
        this.children = new THREE.Object3D();
        this.offset.position.set(0, length, 0);
        this.dot = new Dot(Color.Blue).getObject();
        this.dot_active = new Dot(Color.Red).getObject();
        this.principal.add(this.offset);
        this.principal.add(this.primitive);
        this.principal.add(this.link);
        this.offset.add(this.children);
        if (!phantom) {
            this.offset.add(this.dot);
            this.offset.add(this.dot_active);
        }
    }
    VElement.prototype.setVisibility = function (value) {
        this.principal.visible = value;
    };
    VElement.prototype.setLength = function (length) {
        this.offset.position.set(0, length, 0);
        this.link.setLength(length);
    };
    VElement.prototype.setPosition = function (x, y) {
        this.principal.position.set(x, y, 0);
    };
    VElement.prototype.SetRotation = function (alpha) {
        this.principal.rotation.set(0, 0, alpha);
    };
    VElement.prototype.addChild = function (child) {
        this.children.add(child.principal);
    };
    VElement.prototype.setPrimitive = function (object) {
        if (object == null)
            return;
        this.iPrimitive = object;
        this.primitive.add(object.getObject());
        this.link.visible = false;
    };
    VElement.prototype.getPrincipal = function () {
        return this.principal;
    };
    VElement.prototype.getIPrimitive = function () {
        return this.iPrimitive;
    };
    VElement.prototype.showDots = function (value) {
        this.dot.visible = value;
        this.dot_active.visible = value;
    };
    return VElement;
}());
var Visual = (function () {
    function Visual(length) {
        this.isVisual = true;
        this.mode = NodeMode.Edit;
        this.length = length;
        this.primary = new VElement(length, false);
        this.secondary = new VElement(length, true);
    }
    Visual.prototype.setMode = function (mode) {
        switch (mode) {
            case NodeMode.Play:
                this.secondary.setVisibility(false);
                this.primary.setVisibility(true);
                this.primary.showDots(false);
                break;
            case NodeMode.Edit:
                this.secondary.setVisibility(true);
                this.primary.setVisibility(true);
                this.primary.showDots(true);
                break;
        }
    };
    Visual.prototype.activate = function () {
        //this.dot_active.visible = true;
    };
    Visual.prototype.deactivate = function () {
        //this.dot_active.visible = false;
    };
    Visual.prototype.rotate = function (x, secondary) {
        if (secondary)
            this.secondary.SetRotation(x);
        else
            this.primary.SetRotation(x);
    };
    Visual.prototype.position = function (x, y, secondary) {
        if (secondary)
            this.secondary.setPosition(x, y);
        else
            this.primary.setPosition(x, y);
    };
    Visual.prototype.getPrimary = function () {
        return this.primary;
    };
    Visual.prototype.getSecondary = function () {
        return this.secondary;
    };
    Visual.prototype.displaySecondary = function (display) {
        this.secondary.setVisibility(display);
    };
    Visual.prototype.add = function (visual) {
        this.primary.addChild(visual.primary);
        this.secondary.addChild(visual.secondary);
    };
    Visual.prototype.addPrimary = function (object) {
        this.primary.setPrimitive(object);
    };
    Visual.prototype.addSecondary = function (object) {
        this.secondary.setPrimitive(object);
    };
    Visual.prototype.setLength = function (length) {
        this.length = length;
        this.primary.setLength(length);
        this.secondary.setLength(length);
    };
    Visual.prototype.serialize = function () {
        return {
            "length": this.length,
            "primary": this.primary.getIPrimitive() != null ? this.primary.getIPrimitive().serialize() : null,
            "secondary": this.secondary.getIPrimitive() != null ? this.secondary.getIPrimitive().serialize() : null
        };
    };
    Visual.deserialize = function (object) {
        var retObject = object["length"] == null ?
            object["primary"] == null ? new Visual(0) :
                new Visual(object["primary"]["length"]) : new Visual(object["length"]);
        if (object["primary"] != null)
            retObject.addPrimary(Primitives.getPrimitive(object["primary"]["name"], object["primary"]));
        if (object["secondary"] != null)
            retObject.addSecondary(Primitives.getPrimitive(object["secondary"]["name"], object["secondary"]));
        return retObject;
    };
    return Visual;
}());
