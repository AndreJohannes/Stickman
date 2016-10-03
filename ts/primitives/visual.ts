/// <reference path="../definitions/three.d.ts" />
/// <reference path="../primitives/dots.ts" />

class Visual extends THREE.Object3D{

	private dot: THREE.Object3D;
	private dot_active: THREE.Object3D;
	private isVisual: Boolean = true;


	constructor(){
		super();
		this.dot = new Dot(Color.Blue).getObject();
		this.dot_active = new Dot(Color.Red).getObject();
		this.add(this.dot);
		this.add(this.dot_active);
	}

	public activate() {
		this.dot_active.visible = true;
	}

	public deactivate() {
		this.dot_active.visible = false;
	}

	public setDotPosition(x:number, y:number){
		this.dot.position.set(x, y, 0);
		this.dot_active.position.set(x, y, 0);
	}

	public rotate(x: number){
		this.rotation.set(0, 0, x);
	}


}