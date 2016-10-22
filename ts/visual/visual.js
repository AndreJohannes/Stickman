/// <reference path="../definitions/three.d.ts" />
/// <reference path="../visual/dots.ts" />
/// <reference path="./primitives/factory.ts" />
/// <reference path="../figures/node.ts" />
/// <reference path="../visual/primitives/link.ts" />
var VElement = (function () {
    function VElement(length) {
        this.principal = new THREE.Object3D();
        this.offset = new THREE.Object3D();
        this.primitive = new THREE.Object3D();
        this.link = new VLink(length);
        this.children = new THREE.Object3D();
        this.offset.position.set(0, length, 0);
        this.dot = new Dot(Color.Blue).getObject();
        this.dot_active = new Dot(Color.Red).getObject();
        this.principal.add(this.offset);
        this.principal.add(this.primitive);
        this.principal.add(this.link);
        this.offset.add(this.dot);
        this.offset.add(this.dot_active);
        this.offset.add(this.children);
    }
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
        this.primitive.add(object.getObject());
    };
    VElement.prototype.getPrincipal = function () {
        return this.principal;
    };
    return VElement;
}());
var Visual = (function () {
    function Visual(length) {
        //private primaryPrimitive: IPrimitives;
        //private secondaryPrimitive: IPrimitives;
        //private dot: THREE.Object3D;
        //private dot_active: THREE.Object3D;
        this.isVisual = true;
        this.mode = NodeMode.Edit;
        this.primary = new VElement(length);
        this.secondary = new VElement(length);
    }
    Visual.prototype.setMode = function (mode) {
        switch (mode) {
            case NodeMode.Play:
                //this.secondary.visible = false;
                //this.primary.visible = true;
                //this.dot.visible = false;
                //this.dot_active.visible = false;
                break;
            case NodeMode.Edit:
                //this.secondary.visible = true;
                //this.primary.visible = true;
                //this.dot.visible = true;
                //this.dot_active.visible = false;
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
        return this.primary.getPrincipal();
    };
    Visual.prototype.getSecondary = function () {
        return this.secondary.getPrincipal();
    };
    //public showSecondary(show: boolean) {
    //	this.secondary.visible = show;
    //}
    Visual.prototype.add = function (visual) {
        this.primary.addChild(visual.primary);
        this.secondary.addChild(visual.secondary);
    };
    Visual.prototype.addPrimary = function (object) {
        this.primary.setPrimitive(object);
        //this.primaryPrimitive = object;
    };
    Visual.prototype.addSecondary = function (object) {
        this.secondary.setPrimitive(object);
        //this.secondaryPrimitive = object;
    };
    //public setLength(length: number) {
    //	this.primaryPrimitive.setLength(length);
    //	this.secondaryPrimitive.setLength(length);
    //}
    Visual.prototype.serialize = function () {
        //return {
        //	"primary": this.primaryPrimitive != null ? this.primaryPrimitive.serialize() : null,
        //	"secondary": this.secondaryPrimitive != null ? this.secondaryPrimitive.serialize() : null
        //};
    };
    Visual.deserialize = function (object) {
        return null;
        //let retObject = new Visual();
        //if (object["primary"] != null)
        //	retObject.addPrimary(Primitives.getPrimitive(object["primary"]["name"], object["primary"]));
        //if (object["secondary"] != null)
        //	retObject.addSecondary(Primitives.getPrimitive(object["secondary"]["name"], object["secondary"]));
        //return retObject;
    };
    return Visual;
}());
