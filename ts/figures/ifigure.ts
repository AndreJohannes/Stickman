/// <reference path="./node.ts" />

class FigureWrapped {

	public name: string;
	public root: Object;

}

interface IFigure {

	getVisual(): THREE.Object3D;

	getPhantom(): THREE.Object3D;

	getRoot(): Node_;

	serialize(): FigureWrapped;

	getName(): string;

	setName(name: string);

}

class GenericFigure implements IFigure {

	private root: Node_;
	private name: string;

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
		return this.name;
	}

	public setName(name: string) {
		this.name = name;
	}

	public serialize(): FigureWrapped {
		let figure = new FigureWrapped();
		figure.name = this.name;
		figure.root = this.root.serialize();
		return figure;
	};

	static deserialize(object: Object): IFigure {
		var figure = new GenericFigure();
		figure.name = object["name"];
		figure.root = new Node_(object["root"]);
		return figure;
	}
}

class MonadFigure implements IFigure {

	private root: Node_;
	private name: string;

	constructor(rect: Rect) {
		let root: Node_ = new Node_(new THREE.Vector2(0, 0));
		let monad: Node_ = new Node_(rect.getLength(), 0);
		root.addChild(monad);
		monad.addVisual(new Rectangle(rect), new Rectangle(rect));
		this.root = root;
		this.name = "Monad";
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
		return this.name;
	}

	public setName(name: string) {
		this.name = name;
	}

	public serialize(): FigureWrapped {
		let figure = new FigureWrapped();
		figure.name = this.name;
		figure.root = this.root.serialize();
		return figure;
	};

}
class PivotFigure implements IFigure {

	private root: Node_;
	private name: string;

	constructor(root: Node_) {
		this.root = root;
		this.name = "Pivot";
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
		return this.name;
	}

	public setName(name: string) {
		this.name = name;
	}

	public serialize(): FigureWrapped {
		let figure = new FigureWrapped();
		figure.name = this.name;
		figure.root = this.root.serialize();
		return figure;
	};

}



