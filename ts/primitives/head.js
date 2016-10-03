/// <reference path="../definitions/three.d.ts" />
/// <reference path="./textures.ts" />
var Head = (function () {
    function Head(size) {
        this.object = new THREE.Object3D();
        this.size = size;
        var texture = TextureHandler.getTexture(TextureHandler.Texture.Stickman1);
        texture.minFilter = THREE.LinearFilter;
        //texture.magFilter= THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true,
            opacity: 0.5
        });
        var mesh = new THREE.Mesh(this.makeGeometry(), material);
        mesh.position.set(0, this.size / 2, 0);
        this.object.add(mesh);
    }
    Head.prototype.getObject = function () {
        return this.object;
    };
    Head.prototype.makeGeometry = function () {
        var geometry = new THREE.Geometry();
        var wd = this.size;
        geometry.vertices.push(new THREE.Vector3(-wd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(-wd / 2, wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, wd / 2, 0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(3, 2, 1));
        var vertexUvs0 = new THREE.Vector2(1 / 512, 1 - 1 / 512);
        var vertexUvs1 = new THREE.Vector2(51 / 512, 1 - 1 / 512);
        var vertexUvs2 = new THREE.Vector2(1 / 512, 1 - 52 / 512);
        var vertexUvs3 = new THREE.Vector2(51 / 512, 1 - 52 / 512);
        geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
        geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        return geometry;
    };
    return Head;
}());
