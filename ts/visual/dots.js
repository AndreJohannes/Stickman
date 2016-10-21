/// <reference path="../definitions/three.d.ts" />
/// <reference path="./textures.ts" />
var Color;
(function (Color) {
    Color[Color["Blue"] = 0] = "Blue";
    Color[Color["Red"] = 1] = "Red";
})(Color || (Color = {}));
var Dot = (function () {
    function Dot(color) {
        this.width = 8;
        this.color = color;
        var texture = TextureHandler.Stickman;
        texture.minFilter = THREE.LinearFilter;
        //texture.magFilter= THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true
        });
        var mesh = new THREE.Mesh(this.makeGeometry(color), material);
        //mesh.position.set(-this.width / 2, 0, 0);
        mesh.renderOrder = color == Color.Blue ? 100 : 101;
        this.object = mesh;
    }
    Dot.prototype.getObject = function () {
        return this.object;
    };
    Dot.prototype.makeGeometry = function (color) {
        var geometry = new THREE.Geometry();
        var wd = this.width;
        geometry.vertices.push(new THREE.Vector3(-wd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(-wd / 2, wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, wd / 2, 0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(3, 2, 1));
        if (color == Color.Blue) {
            var vertexUvs0 = new THREE.Vector2(52 / 512, 1 - 1 / 512);
            var vertexUvs1 = new THREE.Vector2(102 / 512, 1 - 1 / 512);
            var vertexUvs2 = new THREE.Vector2(52 / 512, 1 - 52 / 512);
            var vertexUvs3 = new THREE.Vector2(102 / 512, 1 - 52 / 512);
            geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
            geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        }
        else {
            var vertexUvs0 = new THREE.Vector2(103 / 512, 1 - 1 / 512);
            var vertexUvs1 = new THREE.Vector2(152 / 512, 1 - 1 / 512);
            var vertexUvs2 = new THREE.Vector2(103 / 512, 1 - 52 / 512);
            var vertexUvs3 = new THREE.Vector2(153 / 512, 1 - 52 / 512);
            geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
            geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        }
        return geometry;
    };
    return Dot;
}());
