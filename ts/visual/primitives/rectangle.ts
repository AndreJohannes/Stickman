/// <reference path="../../definitions/three.d.ts" />
/// <reference path="../textures.ts" />
/// <reference path="./factory.ts" />

class Rect {

	private x1: number;
	private y1: number;
	private x2: number;
	private y2: number;
	private anchor: THREE.Vector2;
	private pivot: THREE.Vector2;
	private texture: THREE.Texture;

	constructor(x1, y1, x2, y2, texture: THREE.Texture) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.texture = texture;
	}

	public setAnchor(anchor: THREE.Vector2) {
		this.anchor = anchor;
	}

	public setPivot(pivot: THREE.Vector2) {
		this.pivot = pivot;
	}

	public getWidth() { return this.x2 - this.x1; }
	public getHeight() { return this.y2 - this.y1; }

	public getUVx1(): number {
		return this.x1 / this.texture.image.width;
	}

	public getUVy1(): number {
		return 1 - this.y1 / this.texture.image.height;
	}

	public getUVx2(): number {
		return this.x2 / this.texture.image.width;
	}

	public getUVy2(): number {
		return 1 - this.y2 / this.texture.image.height;
	}

	public getRelativePivot() {
		return new THREE.Vector2(this.pivot.x - (this.x1 + this.x2) / 2, this.pivot.y - (this.y1 + this.y2) / 2);
	}

	public getLength() {
		return this.pivot.distanceTo(this.anchor);
	}

	public getAlpha() {
		return Math.atan2(this.pivot.x - this.anchor.x, this.pivot.y - this.anchor.y);
	}

	public getTexture(): THREE.Texture {
		return this.texture;
	}

	public copy(): Rect {
		let rect = new Rect(this.x1, this.y1, this.x2, this.y2, this.texture);
		rect.setPivot(this.pivot);
		rect.setAnchor(this.anchor);
		return rect;
	}

	public serialize() {
		return { "x1": this.x1, "x2": this.x2, "y1": this.y1, "y2": this.y2, "texture": this.texture.uuid }
	}

	public static deserialize(object: Object): Rect{
		let texture: THREE.Texture = TextureHandler.getInstance().getTexture(object["uuid"]);
	}

}


class Rectangle implements IPrimitives {

	private object: THREE.Object3D = new THREE.Object3D();
	private rect: Rect;

	constructor(rect: Rect, phantom = false) {
		this.rect = rect;
		let material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: rect.getTexture(),
			transparent: true,
			opacity: phantom ? 0.5 : 1
			//	depthWrite: false
		});
		let mesh = new THREE.Mesh(this.makeGeometry(rect), material);
		mesh.position.set(-rect.getRelativePivot().x, rect.getRelativePivot().y, 0);
		var object = new THREE.Object3D();
		object.add(mesh);
		object.rotateZ(-rect.getAlpha());
		this.object.add(object);
	}

	public getObject(): THREE.Object3D {
		return this.object;
	}

	public setLength() {
		// for now do nothing
	}

	public copy(): Rectangle {
		return new Rectangle(this.rect);
	}

	public serialize() {
		return this._serialize();
	}

	private makeGeometry(rect: Rect): THREE.Geometry {

		let geometry = new THREE.Geometry();
		let wd = rect.getWidth();
		let hd = rect.getHeight();

		geometry.vertices.push(new THREE.Vector3(-wd / 2, hd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(-wd / 2, -hd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(wd / 2, hd / 2, 0));
		geometry.vertices.push(new THREE.Vector3(wd / 2, -hd / 2, 0));
		geometry.faces.push(new THREE.Face3(0, 1, 2));
		geometry.faces.push(new THREE.Face3(3, 2, 1));

		let vertexUvs0 = new THREE.Vector2(rect.getUVx1(), rect.getUVy1());
		let vertexUvs1 = new THREE.Vector2(rect.getUVx1(), rect.getUVy2());
		let vertexUvs2 = new THREE.Vector2(rect.getUVx2(), rect.getUVy1());
		let vertexUvs3 = new THREE.Vector2(rect.getUVx2(), rect.getUVy2());


		geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
		geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
		return geometry;
	}

	private _serialize() {
		return { "name": "rectangle", "phantom": false }
	}

}
