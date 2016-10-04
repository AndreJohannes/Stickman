/// <reference path="../definitions/three.d.ts" />
/// <reference path="../primitives/dots.ts" />

class Visual {

	private primary: THREE.Object3D;
	private secondary: THREE.Object3D;

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

	public rotate(x: number , secondary?: Boolean) {
		if (secondary)
			this.secondary.rotation.set(0, 0, x);
		else
			this.primary.rotation.set(0, 0, x);
	}

	public position(x: number, y: number, secondary?: Boolean){
		if(secondary)
			this.secondary.position.set(x,y, 0);
		else
			this.primary.position.set(x,y,0);
	}
	public getPrimary() {
		return this.primary;
	}

	public add(visual: Visual) {
		this.primary.add(visual.primary);
		this.secondary.add(visual.secondary);
	}

	public addPrimary(object: THREE.Object3D){
		this.primary.add(object);
	}

	public addSecondary(object: THREE.Object3D){
		this.secondary.add(object);
	}

}