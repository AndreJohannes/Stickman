/// <reference path="../definitions/three.d.ts" />
/// <reference path="../primitives/dots.ts" />
var Node_ = (function () {
    function Node_(pointOrLength, alpha) {
        this.children = [];
        this.visual = new THREE.Object3D;
        this.dot = new Dot(Color.Blue).getObject();
        this.dot_active = new Dot(Color.Red).getObject();
        if (pointOrLength.isVector2 == true) {
            this.position = pointOrLength;
            this._isRoot = true;
            this.alpha = 0;
        }
        else {
            this.length = pointOrLength;
            this.alpha = alpha;
            this.visual.rotation.set(0, 0, alpha);
            this._isRoot = false;
            this.dot.position.set(0, this.length, 0);
            this.dot_active.position.set(0, this.length, 0);
        }
        this.visual.add(this.dot);
        this.dot_active.visible = false;
        this.visual.add(this.dot_active);
    }
    Node_.prototype.isRoot = function () {
        return this._isRoot;
    };
    Node_.prototype.addChild = function (node) {
        this.children.push(node);
        node.parent_ = this;
        if (this.visual != null && node.visual != null) {
            this._addVisual(node.visual);
        }
    };
    Node_.prototype.addVisual = function (visual) {
        if (this.parent_ != null && this.parent_.visual != null) {
            this.parent_._addVisual(visual);
            this.visual.add(visual);
        }
    };
    Node_.prototype.getVisual = function () {
        return this.visual;
    };
    Node_.prototype.setAlpha = function (alpha) {
        if (this._isRoot)
            return;
        this.alpha = alpha;
        if (this.visual != null) {
            this.visual.rotation.set(0, 0, alpha);
        }
    };
    Node_.prototype.setPosition = function (x, y) {
        if (this.isRoot) {
            this.position = new THREE.Vector2(x, y);
            this.visual.position.set(x, -y, 0);
        }
    };
    Node_.prototype.getChild = function (idx) {
        return this.children[idx];
    };
    Node_.prototype.getProximityNodes = function (radius, position) {
        return this._getProximityNodes(radius, 0, position, new THREE.Vector2(0, 0));
    };
    ;
    Node_.prototype.activate = function () {
        this.dot_active.visible = true;
    };
    Node_.prototype.deactivate = function () {
        this.dot_active.visible = false;
    };
    Node_.prototype._getProximityNodes = function (radius, alpha, position, anchor_position) {
        var beta = alpha + this.alpha;
        var pos = this._isRoot ? this.position : new THREE.Vector2(-Math.sin(beta) * this.length, -Math.cos(beta) * this.length);
        var distance = position.distanceTo(pos);
        var dic = { "distance": distance, "node": this, "pivot": anchor_position, "alpha": alpha };
        var retValue = distance < radius ? dic : null;
        var position_new = position.clone();
        position_new.sub(pos);
        var anchor_position_new = anchor_position.clone();
        anchor_position_new.add(pos);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var node = _a[_i];
            var childeNode = node._getProximityNodes(radius, beta, position_new, anchor_position_new);
            if (retValue != null) {
                if (childeNode != null) {
                    if (retValue.distance > childeNode.distance) {
                        retValue = childeNode;
                    }
                }
            }
            else {
                retValue = childeNode;
            }
        }
        return retValue;
    };
    Node_.prototype._addVisual = function (visual) {
        if (this._isRoot) {
            this.visual.add(visual);
        }
        else {
            var object = new THREE.Object3D();
            object.position.set(0, this.length, 0);
            object.add(visual);
            this.visual.add(object);
        }
    };
    return Node_;
}());
