/// <reference path="../definitions/three.d.ts" />
/// <reference path="../primitives/visual.ts" />
var Node_ = (function () {
    function Node_(pointOrLength, alpha) {
        this.children = [];
        if (pointOrLength.isVector2 == true) {
            this.position = new FSArray(pointOrLength);
            this._isRoot = true;
            this.alpha = null;
            this.visual = new Visual();
        }
        else {
            this.length = pointOrLength;
            this.alpha = new FSArray(alpha);
            this._isRoot = false;
            this.visual = new Visual();
            this.visual.rotate(alpha);
            this.visual.setDotPosition(0, this.length);
        }
    }
    Node_.prototype.isRoot = function () {
        return this._isRoot;
    };
    Node_.prototype.draw = function (frame) {
        if (this._isRoot) {
            var position = this.position.get(frame);
            this.visual.position(position.x, -position.y);
        }
        else
            this.visual.rotate(this.alpha.get(frame));
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.draw(frame);
        }
    };
    Node_.prototype.addChild = function (node) {
        this.children.push(node);
        node.parent_ = this;
        if (this.visual != null && node.visual != null) {
            this._addVisual(node.visual);
        }
    };
    Node_.prototype.addVisual = function (object, phantom) {
        if (this.parent_ != null && this.parent_.visual != null) {
            //this.parent_._addVisual(visual);
            this.visual.addPrimary(object);
            this.visual.addSecondary(phantom);
        }
    };
    Node_.prototype.getVisual = function () {
        return this.visual.getPrimary();
    };
    Node_.prototype.setAlpha = function (alpha, frame) {
        if (this._isRoot)
            return;
        this.alpha.set(frame, alpha);
    };
    Node_.prototype.setPosition = function (x, y, frame) {
        if (this.isRoot) {
            this.position.set(frame, new THREE.Vector2(x, y));
        }
    };
    Node_.prototype.getChild = function (idx) {
        return this.children[idx];
    };
    Node_.prototype.getProximityNodes = function (frame, radius, position) {
        return this._getProximityNodes(radius, 0, frame, position, new THREE.Vector2(0, 0));
    };
    ;
    Node_.prototype.activate = function () {
        this.visual.activate();
    };
    Node_.prototype.deactivate = function () {
        this.visual.deactivate();
    };
    Node_.prototype._getProximityNodes = function (radius, alpha, frame, position, anchor_position) {
        var beta = this._isRoot ? 0 : alpha + this.alpha.get(frame);
        var pos = this._isRoot ? this.position.get(frame) : new THREE.Vector2(-Math.sin(beta) * this.length, -Math.cos(beta) * this.length);
        var distance = position.distanceTo(pos);
        var dic = { "distance": distance, "node": this, "pivot": anchor_position, "alpha": alpha };
        var retValue = distance < radius ? dic : null;
        var position_new = position.clone();
        position_new.sub(pos);
        var anchor_position_new = anchor_position.clone();
        anchor_position_new.add(pos);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var node = _a[_i];
            var childeNode = node._getProximityNodes(radius, beta, frame, position_new, anchor_position_new);
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
        this.visual.add(visual);
        if (!this._isRoot) {
            visual.position(0, this.length);
            visual.position(0, this.length, true);
        }
    };
    return Node_;
}());
var FSArray = (function () {
    function FSArray(initial) {
        this.array = [initial];
    }
    FSArray.prototype.get = function (i) {
        while (this.array[i] == null) {
            i--;
        }
        return this.array[i];
    };
    FSArray.prototype.set = function (i, value) {
        this.array[i] = value;
    };
    return FSArray;
}());
