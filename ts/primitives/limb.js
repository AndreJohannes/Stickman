/// <reference path="../definitions/three.d.ts" />
/// <reference path="./textures.ts" />
var Limb = (function () {
    function Limb(length) {
        this.object = new THREE.Object3D();
        this.width = 8;
        this.length = length;
        var texture = TextureHandler.getTexture(TextureHandler.Texture.Stickman1);
        texture.minFilter = THREE.LinearFilter;
        //texture.magFilter= THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true,
            opacity: 0.2
        });
        var mesh = new THREE.Mesh(this.makeGeometry(), material);
        mesh.position.set(-this.width / 2, 0, 0);
        this.object.add(mesh);
    }
    Limb.prototype.getObject = function () {
        return this.object;
    };
    Limb.prototype.makeGeometry = function () {
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
        var vertexUvs0 = new THREE.Vector2(1 / 512, 1 - 1 / 512);
        var vertexUvs1 = new THREE.Vector2(51 / 512, 1 - 1 / 512);
        var vertexUvs2 = new THREE.Vector2(1 / 512, 1 - 26 / 512);
        var vertexUvs3 = new THREE.Vector2(51 / 512, 1 - 26 / 512);
        var vertexUvs4 = new THREE.Vector2(1 / 512, 1 - 27 / 512);
        var vertexUvs5 = new THREE.Vector2(51 / 512, 1 - 27 / 512);
        var vertexUvs6 = new THREE.Vector2(1 / 512, 1 - 52 / 512);
        var vertexUvs7 = new THREE.Vector2(51 / 512, 1 - 52 / 512);
        geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
        geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        geometry.faceVertexUvs[0].push([vertexUvs2, vertexUvs3, vertexUvs4]);
        geometry.faceVertexUvs[0].push([vertexUvs5, vertexUvs4, vertexUvs3]);
        geometry.faceVertexUvs[0].push([vertexUvs4, vertexUvs5, vertexUvs6]);
        geometry.faceVertexUvs[0].push([vertexUvs7, vertexUvs6, vertexUvs5]);
        return geometry;
    };
    return Limb;
}());
