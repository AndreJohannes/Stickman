/// <reference path="../definitions/three.d.ts" />
/// <reference path="../visual/visual.ts" />
var Node_ = (function () {
    function Node_(firstArg, secondArg) {
        this.children = [];
        if (typeof firstArg == "string") {
            this.deserialize(JSON.parse(firstArg));
        }
        else if (firstArg.isRoot != null) {
            this.deserialize(firstArg);
        }
        else if (firstArg.isVector2 == true) {
            this.position = new FSArray(firstArg);
            this._isRoot = true;
            this.alpha = null;
            this.visual = new Visual();
            this.invisible = new FSArray(false);
        }
        else {
            this.length = firstArg;
            this.alpha = new FSArray(secondArg);
            this._isRoot = false;
            this.visual = new Visual();
            this.visual.rotate(secondArg);
            this.visual.setDotPosition(0, this.length);
        }
    }
    Node_.prototype.isRoot = function () {
        return this._isRoot;
    };
    Node_.prototype.attachFigure = function (node) {
        if (!node._isRoot)
            throw new Error("need to attach a root node");
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this.addChild(child);
        }
    };
    Node_.prototype.draw = function (frame) {
        if (this._isRoot) {
            this.visual.getPrimary().visible = !this.invisible.get(frame);
            this.visual.getSecondary().visible = !this.invisible.get(frame - 1);
            var position = this.position.get(frame);
            this.visual.position(position.x, -position.y);
            position = this.position.get(frame - 1 > 0 ? frame - 1 : 1);
            this.visual.position(position.x, -position.y, true);
        }
        else {
            this.visual.rotate(this.alpha.get(frame));
            this.visual.rotate(this.alpha.get(frame - 1 > 0 ? frame - 1 : 1), true);
        }
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.draw(frame);
        }
    };
    Node_.prototype.setLength = function (length) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.visual.position(0, length);
            child.visual.position(0, length, true);
            this.length = length;
        }
        this.visual.setLength(length);
    };
    Node_.prototype.addChild = function (node) {
        this.children.push(node);
        node.parent_ = this;
        if (this.visual != null && node.visual != null) {
            this._addVisual(node.visual);
        }
    };
    Node_.prototype.setMode = function (mode) {
        this.applyToTree(function (mode) { this.visual.setMode(mode); }, mode);
    };
    Node_.prototype.manifest = function (frame) {
        this.applyToTree(function () {
            if (this._isRoot)
                this.position.set(frame, this.position.get(frame));
            else
                this.alpha.set(frame, this.alpha.get(frame));
        }, null);
    };
    Node_.prototype.release = function (frame) {
        this.applyToTree(function () {
            if (this._isRoot)
                this.position.clear(frame);
            else
                this.alpha.clear(frame);
        }, null);
    };
    Node_.prototype.delete = function () {
        // TODO: Implement the function
        //this.parent_.children.
    };
    Node_.prototype.serialize = function () {
        if (!this._isRoot)
            throw new Error("This method should only be called for the root Node");
        return this._serialize();
    };
    Node_.prototype.addVisual = function (object, phantom) {
        if (this.parent_ != null && this.parent_.visual != null) {
            this.visual.addPrimary(object);
            this.visual.addSecondary(phantom);
        }
    };
    Node_.prototype.getVisual = function (secondary) {
        if (secondary)
            return this.visual.getSecondary();
        else
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
    Node_.prototype.getRoot = function () {
        if (this._isRoot)
            return this;
        return this.parent_.getRoot();
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
        if (this._isRoot && this.invisible.get(frame))
            return null;
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
    Node_.prototype._getPosition = function (frame) {
        if (!this._isRoot) {
            var parent = this.parent_._getPosition(frame);
            var alpha = parent.alpha + this.alpha.get(frame);
            var x = parent.x - Math.sin(alpha) * this.length;
            var y = parent.y - Math.cos(alpha) * this.length;
            return { x: x, y: y, alpha: alpha };
        }
        return { x: this.position.get(frame).x, y: this.position.get(frame).y, alpha: 0 };
    };
    Node_.prototype._addVisual = function (visual) {
        this.visual.add(visual);
        if (!this._isRoot) {
            visual.position(0, this.length);
            visual.position(0, this.length, true);
        }
    };
    Node_.prototype._serialize = function () {
        var retObject = {};
        retObject["isRoot"] = this._isRoot;
        retObject["position"] = this.position != null ? this.position.serialize() : null;
        retObject["invisible"] = this.invisible != null ? this.invisible.serialize() : null;
        retObject["length"] = this.length;
        retObject["alpha"] = this.alpha != null ? this.alpha.serialize() : null;
        retObject["visual"] = this.visual.serialize();
        var children = [];
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            children.push(child._serialize());
        }
        retObject["children"] = children;
        return retObject;
    };
    Node_.prototype.deserialize = function (object) {
        this._isRoot = object["isRoot"];
        this.length = object["length"];
        this.visual = Visual.deserialize(object["visual"]);
        this.alpha = FSArray.deserialize(object["alpha"]);
        this.position = FSArray.deserialize(object["position"]);
        this.invisible = FSArray.deserialize(this.position != null && object["invisible"] == null ? [false] : object["invisible"]);
        for (var _i = 0, _a = object["children"]; _i < _a.length; _i++) {
            var child = _a[_i];
            var childNode = new Node_(child, this);
            this.addChild(childNode);
        }
    };
    Node_.prototype.applyToTree = function (func, arg) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.applyToTree(func, arg);
        }
        func.call(this, arg);
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
    FSArray.prototype.has = function (i) {
        return this.array[i] != null;
    };
    FSArray.prototype.clear = function (i) {
        this.array[i] = null;
    };
    FSArray.prototype.serialize = function () {
        return this.array;
    };
    FSArray.deserialize = function (array) {
        if (array == null)
            return null;
        var retObject = new FSArray(null);
        retObject.array = array;
        return retObject;
    };
    return FSArray;
}());
var NodeMode;
(function (NodeMode) {
    NodeMode[NodeMode["Edit"] = 0] = "Edit";
    NodeMode[NodeMode["Play"] = 1] = "Play";
})(NodeMode || (NodeMode = {}));
