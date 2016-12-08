/// <reference path="../../definitions/three.d.ts" />
/// <reference path="./factory.ts" />
/// <reference path="../textures.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VLink = (function (_super) {
    __extends(VLink, _super);
    function VLink(length, phantom) {
        _super.call(this);
        this.object = new THREE.Object3D();
        this.width = 9; //9;
        this.phantom = phantom != null ? phantom : false;
        this.length = length;
        var texture = TextureHandler.Stickman;
        texture.minFilter = THREE.LinearFilter; //MipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true
        });
        this.geometry = this.makeGeometry(this.phantom);
        var mesh = new THREE.Mesh(this.geometry, material);
        mesh.position.set(-this.width / 2, 0, 0);
        mesh.renderOrder = this.phantom ? -1 : 0;
        _super.prototype.add.call(this, mesh);
    }
    VLink.prototype.setLength = function (length) {
        this.length = length;
        this.geometry.vertices[4].setY(length);
        this.geometry.vertices[5].setY(length);
        this.geometry.vertices[6].setY(length + this.width / 2);
        this.geometry.vertices[7].setY(length + this.width / 2);
        this.geometry.verticesNeedUpdate = true;
    };
    VLink.prototype.serialize = function () {
        return this._serialize();
    };
    VLink.prototype.makeGeometry = function (phantom) {
        var geometry = new THREE.Geometry();
        var wd = this.width;
        var lg = this.length;
        geometry.vertices.push(new THREE.Vector3(0, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(wd, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, lg, 0));
        geometry.vertices.push(new THREE.Vector3(wd, lg, 0));
        geometry.vertices.push(new THREE.Vector3(0, lg + wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd, lg + wd / 2, 0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(3, 2, 1));
        geometry.faces.push(new THREE.Face3(2, 3, 4));
        geometry.faces.push(new THREE.Face3(5, 4, 3));
        geometry.faces.push(new THREE.Face3(4, 5, 6));
        geometry.faces.push(new THREE.Face3(7, 6, 5));
        var xOffset = phantom ? 10 : 0;
        var vertexUvs0 = new THREE.Vector2((0 + xOffset) / 512, 1 - 55.5 / 512);
        var vertexUvs1 = new THREE.Vector2((9 + xOffset) / 512, 1 - 55.5 / 512);
        var vertexUvs2 = new THREE.Vector2((0 + xOffset) / 512, 1 - 60 / 512);
        var vertexUvs3 = new THREE.Vector2((9 + xOffset) / 512, 1 - 60 / 512);
        var vertexUvs4 = new THREE.Vector2((0 + xOffset) / 512, 1 - 100 / 512);
        var vertexUvs5 = new THREE.Vector2((9 + xOffset) / 512, 1 - 100 / 512);
        var vertexUvs6 = new THREE.Vector2((0 + xOffset) / 512, 1 - 104.5 / 512);
        var vertexUvs7 = new THREE.Vector2((9 + xOffset) / 512, 1 - 104.5 / 512);
        geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
        geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        geometry.faceVertexUvs[0].push([vertexUvs2, vertexUvs3, vertexUvs4]);
        geometry.faceVertexUvs[0].push([vertexUvs5, vertexUvs4, vertexUvs3]);
        geometry.faceVertexUvs[0].push([vertexUvs4, vertexUvs5, vertexUvs6]);
        geometry.faceVertexUvs[0].push([vertexUvs7, vertexUvs6, vertexUvs5]);
        return geometry;
    };
    VLink.prototype._serialize = function () {
        return { "name": "limb", "length": this.length, "phantom": this.phantom };
    };
    return VLink;
}(THREE.Object3D));
