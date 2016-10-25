/// <reference path="./node.ts" />
/// <reference path="../visual/primitives/rectangle.ts" />
/// <reference path="./ifigure.ts" />

class Background extends IFigure {

	constructor(name: string) {
		super();
		this.name = name;
		let root: Node_ = new Node_(new THREE.Vector2(0, 0));
		let handle: Node_ = new Node_(60, 3.14159);
		root.addChild(handle);
		//handle.addVisual(new Rectangle(), new Rectangle());
		this.root = root;
	}

}
