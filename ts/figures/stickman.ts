/// <reference path="./node.ts" />
/// <reference path="./ifigure.ts" />
/// <reference path="../visual/primitives/limb.ts" />
/// <reference path="../visual/primitives/head.ts" />

class Stickman implements IFigure {

	private root: Node_;
	private name: string;

	constructor(name: string) {
		//this.root = new Node_(localStorage.getItem("stickman"));
		//return
		this.name = name;
		let root: Node_ = new Node_(new THREE.Vector2(0, 0));
		let torso: Node_ = new Node_(60, 0);
		let leg_1: Node_ = new Node_(50, Math.PI * 3 / 4);
		let leg_2: Node_ = new Node_(50, -Math.PI * 3 / 4);
		let shin_1: Node_ = new Node_(50, Math.PI * 1 / 4);
		let shin_2: Node_ = new Node_(50, -Math.PI * 1 / 4);
		let arm_1: Node_ = new Node_(40, Math.PI * 3 / 4);
		let arm_2: Node_ = new Node_(40, -Math.PI * 3 / 4);
		let lower_arm_1: Node_ = new Node_(40, Math.PI * 1 / 4);
		let lower_arm_2: Node_ = new Node_(40, -Math.PI * 1 / 4);
		let head: Node_ = new Node_(35, 0);
		root.addChild(torso);
		root.addChild(leg_1);
		root.addChild(leg_2);
		torso.addChild(arm_1);
		torso.addChild(arm_2);
		torso.addChild(head);
		leg_1.addChild(shin_1);
		leg_2.addChild(shin_2);
		arm_1.addChild(lower_arm_1);
		arm_2.addChild(lower_arm_2);
		torso.addVisual(new Limb(60), new Limb(60, true));
		leg_1.addVisual(new Limb(50), new Limb(50, true));
		leg_2.addVisual(new Limb(50), new Limb(50, true));
		shin_1.addVisual(new Limb(50), new Limb(50, true));
		shin_2.addVisual(new Limb(50), new Limb(50, true));
		arm_1.addVisual(new Limb(40), new Limb(40, true));
		arm_2.addVisual(new Limb(40), new Limb(40, true));
		lower_arm_1.addVisual(new Limb(40), new Limb(40, true));
		lower_arm_2.addVisual(new Limb(40), new Limb(40, true));
		head.addVisual(new Head(35), new Head(35, true));
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

	public setName(name: string) {
		this.name = name;
	}

	public serialize(): FigureWrapped {
		let figure = new FigureWrapped();
		figure.name = this.name;
		figure.root = this.root.serialize();
		return figure;
	}

}
