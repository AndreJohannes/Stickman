/// <reference path="../../definitions/three.d.ts" />
/// <reference path="../textures.ts" />
/// <reference path="./factory.ts" />
var Head = (function () {
    function Head(size, phantom) {
        this.object = new THREE.Object3D();
        this.phantom = phantom != null ? phantom : false;
        this.size = size;
        var texture = TextureHandler.getTexture(TextureHandler.Texture.Stickman1);
        texture.minFilter = THREE.LinearFilter;
        //texture.magFilter= THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true
        });
        var mesh = new THREE.Mesh(this.makeGeometry(this.phantom), material);
        if (this.phantom)
            mesh.renderOrder = this.phantom ? -1 : 0;
        mesh.position.set(0, this.size / 2, 0);
        this.object.add(mesh);
    }
    Head.prototype.getObject = function () {
        return this.object;
    };
    Head.prototype.serialize = function () {
        return this._serialize();
    };
    Head.prototype.makeGeometry = function (phantom) {
        var geometry = new THREE.Geometry();
        var wd = this.size;
        geometry.vertices.push(new THREE.Vector3(-wd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(-wd / 2, wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, wd / 2, 0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(3, 2, 1));
        var xOffset = phantom ? 157 : 1;
        var vertexUvs0 = new THREE.Vector2((0 + xOffset) / 512, 1 - 1 / 512);
        var vertexUvs1 = new THREE.Vector2((50 + xOffset) / 512, 1 - 1 / 512);
        var vertexUvs2 = new THREE.Vector2((0 + xOffset) / 512, 1 - 52 / 512);
        var vertexUvs3 = new THREE.Vector2((50 + xOffset) / 512, 1 - 52 / 512);
        geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
        geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        return geometry;
    };
    Head.prototype._serialize = function () {
        return { "name": "head", "size": this.size, "phantom": this.phantom };
    };
    return Head;
}());
