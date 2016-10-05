/// <reference path="../definitions/three.d.ts" />
/// <reference path="../visual/dots.ts" />
/// <reference path="./primitives/factory.ts" />

class Visual {

	private primary: THREE.Object3D;
	private secondary: THREE.Object3D;
	private primaryPrimitive: IPrimitives;
	private secondaryPrimitive: IPrimitives;
	private dot: THREE.Object3D;
	private dot_active: THREE.Object3D;
	private isVisual: Boolean = true;

	constructor() {
		this.primary = new THREE.Object3D();
		this.secondary = new THREE.Object3D();
		this.dot = new Dot(Color.Blue).getObject();
		this.dot_active = new Dot(Color.Red).getObject();
		this.primary.add(this.dot);
		this.primary.add(this.dot_active);
	}

	public activate() {
		this.dot_active.visible = true;
	}

	public deactivate() {
		this.dot_active.visible = false;
	}

	public setDotPosition(x: number, y: number) {
		this.dot.position.set(x, y, 0);
		this.dot_active.position.set(x, y, 0);
	}

	public rotate(x: number, secondary?: boolean) {
		if (secondary)
			this.secondary.rotation.set(0, 0, x);
		else
			this.primary.rotation.set(0, 0, x);
	}

	public position(x: number, y: number, secondary?: Boolean) {
		if (secondary)
			this.secondary.position.set(x, y, 0);
		else
			this.primary.position.set(x, y, 0);
	}
	public getPrimary(): THREE.Object3D {
		return this.primary;
	}

	public getSecondary(): THREE.Object3D {
		return this.secondary;
	}

	public showSecondary(show: boolean) {
		this.secondary.visible = show;
	}

	public add(visual: Visual) {
		this.primary.add(visual.primary);
		this.secondary.add(visual.secondary);
	}

	public addPrimary(object: IPrimitives) {
		this.primary.add(object.getObject());
		this.primaryPrimitive = object;
	}

	public addSecondary(object: IPrimitives) {
		this.secondary.add(object.getObject());
		this.secondaryPrimitive = object;
	}

	public serialize() {
		return {
			"primary": this.primaryPrimitive != null ? this.primaryPrimitive.serialize() : null,
			"secondary": this.secondaryPrimitive != null ? this.secondaryPrimitive.serialize() : null
		};
	}

	static deserialize(object): Visual{
		let retObject = new Visual();
		if(object["primary"]!=null)
			retObject.addPrimary(Primitives.getPrimitive(object["primary"]["name"], object["primary"]));
		if(object["secondary"]!=null)
			retObject.addSecondary(Primitives.getPrimitive(object["secondary"]["name"], object["secondary"]));
		return retObject;
	}

}