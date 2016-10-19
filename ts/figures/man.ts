/// <reference path="./node.ts" />
/// <reference path="./ifigure.ts" />
/// <reference path="../visual/primitives/rectangle.ts" />



class Man implements IFigure {

	private root: Node_;
	private name: string;

	constructor(name: string) {
		//this.root = new Node_(localStorage.getItem("stickman"));
		//return
		this.name = name;
		let texture = TextureHandler.getTexture(TextureHandler.Texture.Background);
		var rectTorso: Rect = new Rect(6, 13, 33, 95, texture);
		rectTorso.setPivot(new THREE.Vector2(15, 82));
		rectTorso.setAnchor(new THREE.Vector2(17, 24));
		var rectLeg: Rect = new Rect(0, 100, 29, 168, texture);
		rectLeg.setPivot(new THREE.Vector2(15, 112));
		rectLeg.setAnchor(new THREE.Vector2(18.5, 159.5));
		var rectFoot: Rect = new Rect(9, 173, 29, 233, texture);
		rectFoot.setPivot(new THREE.Vector2(18.5, 183.5));
		rectFoot.setAnchor(new THREE.Vector2(17.5, 227.5));
		var rectArm: Rect = new Rect(32, 12, 51, 59, texture);
		rectArm.setPivot(new THREE.Vector2(42, 21));
		rectArm.setAnchor(new THREE.Vector2(42, 51.5));
		var rectHand: Rect = new Rect(34, 124, 50, 168, texture);
		rectHand.setPivot(new THREE.Vector2(42, 131.5));
		rectHand.setAnchor(new THREE.Vector2(42, 164));
		var rectKopf: Rect =  new Rect(68, 33, 109, 88, texture);
		rectKopf.setPivot(new THREE.Vector2(89, 87));
		rectKopf.setAnchor(new THREE.Vector2(89, 40));
		let root: Node_ = new Node_(new THREE.Vector2(0, 0));
		let torso: Node_ = new Node_(rectTorso.getLength(), 0);
		let leg1: Node_ = new Node_(rectLeg.getLength(),Math.PI);
		let foot1: Node_ = new Node_(rectFoot.getLength(),0);
		let leg2: Node_ = new Node_(rectLeg.getLength(),Math.PI);
		let foot2: Node_ = new Node_(rectFoot.getLength(),0);
		let arm1: Node_ = new Node_(rectArm.getLength(), 0);
		let hand1: Node_ = new Node_(rectHand.getLength(),0);
		let kopf: Node_ = new Node_(rectKopf.getLength(), 0);
		root.addChild(torso);
		root.addChild(leg1);
		leg1.addChild(foot1);
		root.addChild(leg2);
		leg2.addChild(foot2);
		torso.addChild(arm1);
		arm1.addChild(hand1);
		torso.addChild(kopf);
		torso.addVisual(new Rectangle(rectTorso), new Rectangle(rectTorso));
		leg1.addVisual(new Rectangle(rectLeg), new Rectangle(rectLeg));
		foot1.addVisual(new Rectangle(rectFoot), new Rectangle(rectFoot));
		leg2.addVisual(new Rectangle(rectLeg), new Rectangle(rectLeg));
		foot2.addVisual(new Rectangle(rectFoot), new Rectangle(rectFoot));
		arm1.addVisual(new Rectangle(rectArm), new Rectangle(rectArm));
		hand1.addVisual(new Rectangle(rectHand), new Rectangle(rectHand));
		kopf.addVisual(new Rectangle(rectKopf), new Rectangle(rectKopf));
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

	public serialize(): FigureWrapped {
		let figure = new FigureWrapped();
		figure.name = this.name;
		figure.root = this.root.serialize();
		return figure;
	}



}