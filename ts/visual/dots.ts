/// <reference path="../definitions/three.d.ts" />
/// <reference path="./textures.ts" />

enum Color {
	Blue,
	Red
}


class Dot {

	private color: Color;
	private width: number = 8;
	private object: THREE.Object3D;

	constructor(color: Color) {
		this.color = color;
		let texture = TextureHandler.getTexture(TextureHandler.Texture.Stickman1);
		texture.minFilter = THREE.LinearFilter;
		//texture.magFilter= THREE.LinearFilter;
		let material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: texture,
			transparent: true,
			//	depthWrite: false
		});
		let mesh = new THREE.Mesh(this.makeGeometry(color), material);
		//mesh.position.set(-this.width / 2, 0, 0);
		mesh.renderOrder = color == Color.Blue ? 100 : 101;
		this.object = mesh;
	}

	public getObject(): THREE.Object3D {
		return this.object;
	}

	private makeGeometry(color: Color): THREE.Geometry {
		let geometry = new THREE.Geometry();
		let wd = this.width;

		geometry.vertices.push(new THREE.Vector3(-wd / 2, -wd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(wd / 2, -wd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(-wd / 2, wd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(wd / 2, wd / 2, 0));
		geometry.faces.push(new THREE.Face3(0, 1, 2));
		geometry.faces.push(new THREE.Face3(3, 2, 1));

		if (color == Color.Blue) {
			let vertexUvs0 = new THREE.Vector2(52 / 512, 1 - 1 / 512);
			let vertexUvs1 = new THREE.Vector2(102 / 512, 1 - 1 / 512);
			let vertexUvs2 = new THREE.Vector2(52 / 512, 1 - 52 / 512);
			let vertexUvs3 = new THREE.Vector2(102 / 512, 1 - 52 / 512);
			geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
			geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
		} else {
			let vertexUvs0 = new THREE.Vector2(103 / 512, 1 - 1 / 512);
			let vertexUvs1 = new THREE.Vector2(152 / 512, 1 - 1 / 512);
			let vertexUvs2 = new THREE.Vector2(103 / 512, 1 - 52 / 512);
			let vertexUvs3 = new THREE.Vector2(153 / 512, 1 - 52 / 512);
			geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
			geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
		}

		return geometry;

	}


}