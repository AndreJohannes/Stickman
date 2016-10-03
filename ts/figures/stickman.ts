/// <reference path="./node.ts" />
/// <reference path="../primitives/limb.ts" />
/// <reference path="../primitives/head.ts" />

class Stickman {

	private root: Node_;

	constructor() {
		let root: Node_ = new Node_(new THREE.Vector2(0, 0));
		let torso: Node_ = new Node_(60, 0);
		let leg_1: Node_ = new Node_(50, Math.PI * 3 / 4);
		let leg_2: Node_ = new Node_(50, -Math.PI * 3 / 4);
		let shin_1: Node_ = new Node_(50, Math.PI * 1 / 4);
		let shin_2: Node_ = new Node_(50, -Math.PI * 1 / 4);
		let arm_1: Node_ = new Node_(40, Math.PI * 3/4);
		let arm_2: Node_ = new Node_(40, -Math.PI * 3/4);
		let lower_arm_1: Node_ = new Node_(40, Math.PI * 1/4);
		let lower_arm_2: Node_ = new Node_(40, -Math.PI * 1/4);
		let head: Node_ = new Node_(31, 0);
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
		torso.addVisual((new Limb(60)).getObject());
		leg_1.addVisual((new Limb(50)).getObject());
		leg_2.addVisual((new Limb(50)).getObject());
		shin_1.addVisual((new Limb(50)).getObject());
		shin_2.addVisual((new Limb(50)).getObject());
		arm_1.addVisual((new Limb(40)).getObject());
		arm_2.addVisual((new Limb(40)).getObject());
		lower_arm_1.addVisual((new Limb(40)).getObject());
		lower_arm_2.addVisual((new Limb(40)).getObject());
		head.addVisual((new Head(35)).getObject());
		this.root = root;
	}

	public getObject(): THREE.Object3D {
		return this.root.getVisual();
	}

	public getRoot(): Node_ {
		return this.root;
	}

}
