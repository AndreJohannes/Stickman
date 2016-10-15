/// <reference path="../../definitions/three.d.ts" />
/// <reference path="../textures.ts" />
/// <reference path="./factory.ts" />
var Rectangle = (function () {
    function Rectangle() {
        this.object = new THREE.Object3D();
        var texture = TextureHandler.getTexture(TextureHandler.Texture.Background);
        this.height = 500;
        this.width = 500;
        texture.minFilter = THREE.LinearFilter;
        //texture.magFilter= THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true,
            opacity: 1
        });
        var mesh = new THREE.Mesh(this.makeGeometry(), material);
        mesh.position.set(0, 0, 0);
        this.object.add(mesh);
    }
    Rectangle.prototype.getObject = function () {
        return this.object;
    };
    Rectangle.prototype.setLength = function () {
        // for now do nothing
    };
    Rectangle.prototype.serialize = function () {
        return this._serialize();
    };
    Rectangle.prototype.makeGeometry = function () {
        var geometry = new THREE.Geometry();
        var wd = this.width;
        var hd = this.height;
        geometry.vertices.push(new THREE.Vector3(-hd / 2, wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(-hd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(hd / 2, wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(hd / 2, -wd / 2, 0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(3, 2, 1));
        var vertexUvs0 = new THREE.Vector2(0, 1);
        var vertexUvs1 = new THREE.Vector2(1, 1);
        var vertexUvs2 = new THREE.Vector2(0, 0);
        var vertexUvs3 = new THREE.Vector2(1, 0);
        geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
        geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        return geometry;
    };
    Rectangle.prototype._serialize = function () {
        return { "name": "rectangle", "phantom": false };
    };
    return Rectangle;
}());
