/// <reference path="../definitions/three.d.ts" />
/// <reference path="../visual/visual.ts" />

class Node_ {

	private _isRoot: Boolean;
	private position: FSArray<THREE.Vector2>;
	private parent_: Node_;
	private length: number;
	private alpha: FSArray<number>;
	private children: Node_[] = [];
	private visual: Visual;

	constructor(firstArg?: any, secondArg?: any) { // TypeScripts way of constructor overloading
		if (typeof firstArg == "string") {
			this.deserialize(JSON.parse(firstArg));
		}else if(firstArg.isRoot!=null){
			this.deserialize(firstArg);
		}else if (firstArg.isVector2 == true) {
			this.position = new FSArray<THREE.Vector2>(firstArg);
			this._isRoot = true;
			this.alpha = null;
			this.visual = new Visual();
		} else {
			this.length = firstArg;
			this.alpha = new FSArray<number>(secondArg);
			this._isRoot = false;
			this.visual = new Visual();
			this.visual.rotate(secondArg);
			this.visual.setDotPosition(0, this.length);
		}
	}

	public isRoot(): Boolean {
		return this._isRoot;
	}

	public draw(frame: number) {
		if (this._isRoot) {
			var position = this.position.get(frame);
			this.visual.position(position.x, -position.y);
			position = this.position.get(frame - 1);
			this.visual.position(position.x, -position.y, true);
		}
		else {
			this.visual.rotate(this.alpha.get(frame));
			this.visual.rotate(this.alpha.get(frame - 1), true);
		}
		for (var child of this.children) {
			child.draw(frame);
		}
	}

	public addChild(node: Node_) {
		this.children.push(node);
		node.parent_ = this;
		if (this.visual != null && node.visual != null) {
			this._addVisual(node.visual);
		}
	}

	public addVisual(object: IPrimitives, phantom: IPrimitives) {
		if (this.parent_ != null && this.parent_.visual != null) {
			//this.parent_._addVisual(visual);
			this.visual.addPrimary(object);
			this.visual.addSecondary(phantom);
			//this.visual.rotation.set(0, 0, this.alpha);
		}
	}

	public getVisual(secondary?: Boolean): THREE.Object3D {
		if (secondary)
			return this.visual.getSecondary();
		else
			return this.visual.getPrimary();
	}

	public setAlpha(alpha: number, frame: number) {
		if (this._isRoot)
			return;
		this.alpha.set(frame, alpha);
	}

	public setPosition(x: number, y: number, frame: number) {
		if (this.isRoot) {
			this.position.set(frame, new THREE.Vector2(x, y));
		}
	}

	public getChild(idx: number) {
		return this.children[idx];
	}

	public getProximityNodes(frame: number, radius: number, position: THREE.Vector2) {
		return this._getProximityNodes(radius, 0, frame, position, new THREE.Vector2(0, 0));
	};

	public activate() {
		this.visual.activate();
	}

	public deactivate() {
		this.visual.deactivate();
	}

	private _getProximityNodes(radius: number, alpha: number, frame: number,
								position: THREE.Vector2, anchor_position: THREE.Vector2) {
		let beta = this._isRoot ? 0 : alpha + this.alpha.get(frame);
		let pos = this._isRoot ? this.position.get(frame) : new THREE.Vector2(-Math.sin(beta) * this.length, -Math.cos(beta) * this.length);
		let distance = position.distanceTo(pos);
		var dic = { "distance": distance, "node": this, "pivot": anchor_position, "alpha": alpha };
		var retValue: any = distance < radius ? dic : null;
		let position_new = position.clone();
		position_new.sub(pos);
		let anchor_position_new = anchor_position.clone();
		anchor_position_new.add(pos);
		for (let node of this.children) {
			var childeNode = node._getProximityNodes(radius, beta, frame, position_new, anchor_position_new);
			if (retValue != null) {
				if (childeNode != null) {
					if (retValue.distance > childeNode.distance) {
						retValue = childeNode;
					}
				}
			} else {
				retValue = childeNode;
			}
		}
		return retValue;
	}

	private _addVisual(visual: Visual) {
		this.visual.add(visual);
		if (!this._isRoot) {
			visual.position(0, this.length);
			visual.position(0, this.length, true);
		}
	}

	private serialize() {
		let retObject = {};
		retObject["isRoot"] = this._isRoot;
		retObject["position"] = this.position != null ? this.position.serialize() : null;
		retObject["length"] = this.length;
		retObject["alpha"] = this.alpha != null ? this.alpha.serialize() : null;
		retObject["visual"] = this.visual.serialize();
		var children = [];
		for (var child of this.children)
			children.push(child.serialize());
		retObject["children"] = children;
		return retObject;
	}

	private deserialize(object) {
		this._isRoot = object["isRoot"];
		this.length = object["length"];
		this.visual = Visual.deserialize(object["visual"]);
		this.alpha = FSArray.deserialize<number>(object["alpha"]);
		this.position = FSArray.deserialize<THREE.Vector2>(object["position"]);
		for(var child of object["children"]){
			let childNode = new Node_(child, this);
			this.children.push(childNode);
			this.addChild(childNode);
		}
	}

}

class FSArray<T>{

	private array: T[];

	constructor(initial: T) {
		this.array = [initial];
	}

	public get(i: number): T {
		while (this.array[i] == null) {
			i--;
		}
		return this.array[i];
	}

	public set(i: number, value: T) {
		this.array[i] = value;
	}

	public serialize(): T[] {
		return this.array;
	}

	static deserialize<T>(array: T[]) : FSArray<T>{
		if(array==null)
			return null;
		let retObject =  new FSArray<T>(null);
		retObject.array = array;
		return retObject;
	}

}

