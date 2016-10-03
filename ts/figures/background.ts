/// <reference path="./node.ts" />
/// <reference path="../primitives/rectangle.ts" />


class Background {

	private root: Node_;

	constructor() {
		let root: Node_ = new Node_(new THREE.Vector2(0, 0));
		let handle: Node_ = new Node_(60, 0);	
		root.addChild(handle);
		handle.addVisual((new Rectangle()).getObject());
		this.root = root;
	}

	public getObject(): THREE.Object3D {
		return this.root.getVisual();
	}

	public getRoot(): Node_ {
		return this.root;
	}

}
