/// <reference path="../../definitions/three.d.ts" />
/// <reference path="./factory.ts" />
/// <reference path="../textures.ts" />

class Limb implements IPrimitives{

	private object: THREE.Object3D = new THREE.Object3D();
	private width: number = 9;
	private length: number;
	private phantom: boolean;

	constructor(length: number, phantom?: boolean) {
		this.phantom = phantom!=null ? phantom : false;
		this.length = length;
		let texture = TextureHandler.getTexture(TextureHandler.Texture.Stickman1);
		texture.minFilter = THREE.LinearFilter;
		//texture.magFilter= THREE.LinearFilter;
		let material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: texture,
			transparent: true
			//	depthWrite: false
		});
		let mesh = new THREE.Mesh(this.makeGeometry(this.phantom), material);
		mesh.position.set(-this.width / 2, 0, 0);
		mesh.renderOrder = this.phantom ? -1 : 0;
		this.object.add(mesh);
	}

	public getObject(): THREE.Object3D {
		return this.object;
	}

	public serialize(){
		return this._serialize();
	}

	private makeGeometry(phantom: boolean): THREE.Geometry {

		let geometry = new THREE.Geometry();
		let wd = this.width;
		let lg = this.length;

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

		let xOffset = phantom ? 10 : 0;
		let vertexUvs0 = new THREE.Vector2((0+xOffset) / 512, 1 - 55.5 / 512);
		let vertexUvs1 = new THREE.Vector2((9+xOffset) / 512, 1 - 55.5 / 512);
		let vertexUvs2 = new THREE.Vector2((0+xOffset) / 512, 1 - 60 / 512);
		let vertexUvs3 = new THREE.Vector2((9+xOffset) / 512, 1 - 60 / 512);

		let vertexUvs4 = new THREE.Vector2((0+xOffset) / 512, 1 - 100 / 512);
		let vertexUvs5 = new THREE.Vector2((9+xOffset) / 512, 1 - 100 / 512);
		let vertexUvs6 = new THREE.Vector2((0+xOffset) / 512, 1 - 104.5 / 512);
		let vertexUvs7 = new THREE.Vector2((9+xOffset) / 512, 1 - 104.5 / 512);

		geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
		geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
		geometry.faceVertexUvs[0].push([vertexUvs2, vertexUvs3, vertexUvs4]);
		geometry.faceVertexUvs[0].push([vertexUvs5, vertexUvs4, vertexUvs3]);
		geometry.faceVertexUvs[0].push([vertexUvs4, vertexUvs5, vertexUvs6]);
		geometry.faceVertexUvs[0].push([vertexUvs7, vertexUvs6, vertexUvs5]);
		return geometry;
	}

	private _serialize(){
		return {"name": "limb", "length": this.length, "phantom": this.phantom}
	}

}

