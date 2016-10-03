/// <reference path="../definitions/three.d.ts" />
/// <reference path="./textures.ts" />

class Head {

	private object: THREE.Object3D = new THREE.Object3D();
	private size;

	constructor(size: number) {
		this.size = size;
		let texture = TextureHandler.getTexture(TextureHandler.Texture.Stickman1);
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
		mesh.position.set(0, this.size / 2, 0);
		this.object.add(mesh);
	}

	public getObject(): THREE.Object3D {
		return this.object;
	}

	private makeGeometry(): THREE.Geometry {

		let geometry = new THREE.Geometry();
		let wd = this.size;

		geometry.vertices.push(new THREE.Vector3(-wd / 2, -wd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(wd / 2, -wd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(-wd / 2, wd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(wd / 2, wd / 2, 0));
		geometry.faces.push(new THREE.Face3(0, 1, 2));
		geometry.faces.push(new THREE.Face3(3, 2, 1));

		let vertexUvs0 = new THREE.Vector2(1 / 512, 1 - 1 / 512);
		let vertexUvs1 = new THREE.Vector2(51 / 512, 1 - 1 / 512);
		let vertexUvs2 = new THREE.Vector2(1 / 512, 1 - 52 / 512);
		let vertexUvs3 = new THREE.Vector2(51 / 512, 1 - 52 / 512);
		geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
		geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);

		return geometry;
	}


}