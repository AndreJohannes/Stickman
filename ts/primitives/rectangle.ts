/// <reference path="../definitions/three.d.ts" />
/// <reference path="./textures.ts" />

class Rectangle {

	private object: THREE.Object3D = new THREE.Object3D();
	private width: number;
	private height: number;

	constructor() {
		let texture = TextureHandler.getTexture(TextureHandler.Texture.Background);
		this.height = 500;
		this.width = 500;
		texture.minFilter = THREE.LinearFilter;
		//texture.magFilter= THREE.LinearFilter;
		let material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: texture,
			transparent: true,
			opacity: 0.5
			//	depthWrite: false
		});
		let mesh = new THREE.Mesh(this.makeGeometry(), material);
		mesh.position.set(0, 0, 0);
		this.object.add(mesh);
	}

	public getObject(): THREE.Object3D {
		return this.object;
	}

	private makeGeometry(): THREE.Geometry {

		let geometry = new THREE.Geometry();
		let wd = this.width;
		let hd = this.height;

		geometry.vertices.push(new THREE.Vector3(-hd / 2, wd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(-hd / 2, -wd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(hd / 2, wd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(hd / 2, -wd / 2, 0));
		geometry.faces.push(new THREE.Face3(0, 1, 2));
		geometry.faces.push(new THREE.Face3(3, 2, 1));

		let vertexUvs0 = new THREE.Vector2(0, 1);
		let vertexUvs1 = new THREE.Vector2(1, 1);
		let vertexUvs2 = new THREE.Vector2(0, 0);
		let vertexUvs3 = new THREE.Vector2(1, 0);


		geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
		geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
		return geometry;
	}


}
