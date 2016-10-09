/// <reference path="./node.ts" />

class FigureWrapped{

	public name: string;
	public root: Object;

}

interface IFigure{

	getVisual(): THREE.Object3D;

	getPhantom(): THREE.Object3D;

	getRoot(): Node_;

	serialize(): FigureWrapped;

	getName(): string;

}

class GenericFigure implements IFigure{

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
		return this.name
	}

	public serialize(): FigureWrapped{
		return null;
	};

	static deserialize(object: Object): IFigure{
		var figure = new GenericFigure();
		figure.name = object["name"];
		figure.root = new Node_(object["root"]);
		return figure;
	}

}


