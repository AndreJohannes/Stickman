/// <reference path="./node.ts" />

class FigureWrapped {

	public name: string;
	public root: Object;

}

class IFigure {

	protected root: Node_;
	protected name: string;

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

	public copyFigure(): IFigure{
		let figure = new IFigure();
		figure.name = this.name + "_Copy";
		figure.root = this.root.copy();
		return figure;
	}

	public serialize(): FigureWrapped {
		let figure = new FigureWrapped();
		figure.name = this.name;
		figure.root = this.root.serialize();
		return figure;
	};

	static deserialize(object: Object): IFigure {
		var figure = new IFigure();
		figure.name = object["name"];
		figure.root = new Node_(object["root"]);
		return figure;
	}
}

class MonadFigure extends IFigure {

	constructor(rect: Rect) {
		super();
		let root: Node_ = new Node_(new THREE.Vector2(0, 0));
		let monad: Node_ = new Node_(rect.getLength(), 0);
		root.addChild(monad);
		monad.addVisual(new Rectangle(rect), new Rectangle(rect));
		this.root = root;
		this.name = "Monad";
	}

};

class PivotFigure extends IFigure {

	constructor(root: Node_) {
		super();
		this.root = root;
		this.name = "Pivot";
	}


}



