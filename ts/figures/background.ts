/// <reference path="./node.ts" />
/// <reference path="../visual/primitives/rectangle.ts" />
/// <reference path="./ifigure.ts" />

class Background implements IFigure{

	private root: Node_;
	private name: string;

	constructor(name: string) {
		this.name = name;
		let root: Node_ = new Node_(new THREE.Vector2(0, 0));
		let handle: Node_ = new Node_(60, 3.14159);	
		root.addChild(handle);
		//handle.addVisual(new Rectangle(), new Rectangle());
		this.root = root;
	}

	public getVisual(): THREE.Object3D {
		return this.root.getVisual();
	}

	public getPhantom(): THREE.Object3D {
		return this.root.getVisual(true);
	}

	public getRoot(): Node_ {
		return this.root;
	}

	public getName(): string {
		return this.name
	}

	public serialize(): FigureWrapped{
		let figure = new FigureWrapped();
		figure.name = this.name;
		figure.root = this.root.serialize();
		return figure;
	}

}
