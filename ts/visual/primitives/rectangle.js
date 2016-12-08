/// <reference path="../../definitions/three.d.ts" />
/// <reference path="../textures.ts" />
/// <reference path="./factory.ts" />
var Rect = (function () {
    function Rect(x1, y1, x2, y2, texture) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.texture = texture;
    }
    Rect.prototype.setAnchor = function (anchor) {
        this.anchor = anchor;
    };
    Rect.prototype.setPivot = function (pivot) {
        this.pivot = pivot;
    };
    Rect.prototype.getWidth = function () { return this.x2 - this.x1; };
    Rect.prototype.getHeight = function () { return this.y2 - this.y1; };
    Rect.prototype.getUVx1 = function () {
        return this.x1 / this.texture.image.width;
    };
    Rect.prototype.getUVy1 = function () {
        return 1 - this.y1 / this.texture.image.height;
    };
    Rect.prototype.getUVx2 = function () {
        return this.x2 / this.texture.image.width;
    };
    Rect.prototype.getUVy2 = function () {
        return 1 - this.y2 / this.texture.image.height;
    };
    Rect.prototype.getRelativePivot = function () {
        return new THREE.Vector2(this.pivot.x - (this.x1 + this.x2) / 2, this.pivot.y - (this.y1 + this.y2) / 2);
    };
    Rect.prototype.getLength = function () {
        return this.pivot.distanceTo(this.anchor);
    };
    Rect.prototype.getAlpha = function () {
        return Math.atan2(this.pivot.x - this.anchor.x, this.pivot.y - this.anchor.y);
    };
    Rect.prototype.getTexture = function () {
        return this.texture;
    };
    Rect.prototype.copy = function () {
        var rect = new Rect(this.x1, this.y1, this.x2, this.y2, this.texture);
        rect.setPivot(this.pivot);
        rect.setAnchor(this.anchor);
        return rect;
    };
    Rect.prototype.serialize = function () {
        return { "x1": this.x1, "x2": this.x2, "y1": this.y1, "y2": this.y2, "texture": this.texture.uuid };
    };
    Rect.deserialize = function (object) {
        var texture = TextureHandler.getInstance().getTexture(object["uuid"]);
    };
    return Rect;
}());
var Rectangle = (function () {
    function Rectangle(rect, phantom) {
        if (phantom === void 0) { phantom = false; }
        this.object = new THREE.Object3D();
        this.rect = rect;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: rect.getTexture(),
            transparent: true,
            opacity: phantom ? 0.5 : 1
        });
        var mesh = new THREE.Mesh(this.makeGeometry(rect), material);
        mesh.position.set(-rect.getRelativePivot().x, rect.getRelativePivot().y, 0);
        var object = new THREE.Object3D();
        object.add(mesh);
        object.rotateZ(-rect.getAlpha());
        this.object.add(object);
    }
    Rectangle.prototype.getObject = function () {
        return this.object;
    };
    Rectangle.prototype.setLength = function () {
        // for now do nothing
    };
    Rectangle.prototype.copy = function () {
        return new Rectangle(this.rect);
    };
    Rectangle.prototype.serialize = function () {
        return this._serialize();
    };
    Rectangle.prototype.makeGeometry = function (rect) {
        var geometry = new THREE.Geometry();
        var wd = rect.getWidth();
        var hd = rect.getHeight();
        geometry.vertices.push(new THREE.Vector3(-wd / 2, hd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(-wd / 2, -hd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, hd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, -hd / 2, 0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(3, 2, 1));
        var vertexUvs0 = new THREE.Vector2(rect.getUVx1(), rect.getUVy1());
        var vertexUvs1 = new THREE.Vector2(rect.getUVx1(), rect.getUVy2());
        var vertexUvs2 = new THREE.Vector2(rect.getUVx2(), rect.getUVy1());
        var vertexUvs3 = new THREE.Vector2(rect.getUVx2(), rect.getUVy2());
        geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
        geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        return geometry;
    };
    Rectangle.prototype._serialize = function () {
        return { "name": "rectangle", "phantom": false };
    };
    return Rectangle;
}());
