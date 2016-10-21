/// <reference path="../definitions/three.d.ts" />
/// <reference path="../visual/visual.ts" />

class Node_ {

	private _isRoot: Boolean;
	private parent_: Node_;
	private position: FSArray<THREE.Vector2>;
	private invisible: FSArray<boolean>;
	private alpha: FSArray<number>;
	private length: number;
	private children: Node_[] = [];
	private visual: Visual;

	constructor(firstArg?: any, secondArg?: any) { // TypeScripts way of constructor overloading
		if (typeof firstArg == "string") {
			this.deserialize(JSON.parse(firstArg));
		} else if (firstArg.isRoot != null) {
			this.deserialize(firstArg);
		} else if (firstArg.isVector2 == true) {
			this.position = new FSArray<THREE.Vector2>(firstArg);
			this._isRoot = true;
			this.alpha = null;
			this.visual = new Visual();
			this.invisible = new FSArray<boolean>(false);
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

	public attachFigure(node: Node_) {
		if (!node._isRoot)
			throw new Error("need to attach a root node");
		for (var child of node.children) {
			this.addChild(child);
		}
	}

	public draw(frame: number) {
		if (this._isRoot) {
			this.visual.getPrimary().visible = !this.invisible.get(frame);
			this.visual.getSecondary().visible = !this.invisible.get(frame - 1);
			var position = this.position.get(frame);
			this.visual.position(position.x, -position.y);
			position = this.position.get(frame - 1 > 0 ? frame - 1 : 1);
			this.visual.position(position.x, -position.y, true);
		}
		else {
			this.visual.rotate(this.alpha.get(frame));
			this.visual.rotate(this.alpha.get(frame - 1 > 0 ? frame - 1 : 1), true);
		}
		for (var child of this.children) {
			child.draw(frame);
		}
	}

	public setLength(length: number) {
		for (var child of this.children) {
			child.visual.position(0, length);
			child.visual.position(0, length, true);
			this.length = length;
		}
		this.visual.setLength(length);
	}

	public addChild(node: Node_) {
		this.children.push(node);
		node.parent_ = this;
		if (this.visual != null && node.visual != null) {
			this._addVisual(node.visual);
		}
	}

	public setMode(mode: NodeMode) {
		this.applyToTree(function(mode) { this.visual.setMode(mode) }, mode);
	}

	public manifest(frame: number) {
		this.applyToTree(function() {
			if (this._isRoot)
				this.position.set(frame, this.position.get(frame));
			else
				this.alpha.set(frame, this.alpha.get(frame));
		}, null);
	}

	public release(frame: number) {
		this.applyToTree(function() {
			if (this._isRoot)
				this.position.clear(frame);
			else
				this.alpha.clear(frame);
		}, null);
	}

	public delete() {
		// TODO: Implement the function
		//this.parent_.children.
	}

	public serialize(): Object {
		if (!this._isRoot)
			throw new Error("This method should only be called for the root Node");
		return this._serialize();
	}

	public addVisual(object: IPrimitives, phantom: IPrimitives) {
		if (this.parent_ != null && this.parent_.visual != null) {
			this.visual.addPrimary(object);
			this.visual.addSecondary(phantom);
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

	public getRoot(): Node_ {
		if (this._isRoot)
			return this;
		return this.parent_.getRoot();
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
		if (this._isRoot && this.invisible.get(frame))
			return null;
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

	private _getPosition(frame: number) {
		if (!this._isRoot) {
			var parent = this.parent_._getPosition(frame);
			var alpha = parent.alpha + this.alpha.get(frame);
			var x = parent.x - Math.sin(alpha) * this.length;
			var y = parent.y - Math.cos(alpha) * this.length;
			return { x: x, y: y, alpha: alpha }
		}
		return { x: this.position.get(frame).x, y: this.position.get(frame).y, alpha: 0 }
	}

	private _addVisual(visual: Visual) {
		this.visual.add(visual);
		if (!this._isRoot) {
			visual.position(0, this.length);
			visual.position(0, this.length, true);
		}
	}

	private _serialize(): Object {
		let retObject = {};
		retObject["isRoot"] = this._isRoot;
		retObject["position"] = this.position != null ? this.position.serialize() : null;
		retObject["invisible"] = this.invisible != null ? this.invisible.serialize() : null;
		retObject["length"] = this.length;
		retObject["alpha"] = this.alpha != null ? this.alpha.serialize() : null;
		retObject["visual"] = this.visual.serialize();
		var children = [];
		for (var child of this.children)
			children.push(child._serialize());
		retObject["children"] = children;
		return retObject;
	}

	private deserialize(object: Object) {
		this._isRoot = object["isRoot"];
		this.length = object["length"];
		this.visual = Visual.deserialize(object["visual"]);
		this.alpha = FSArray.deserialize<number>(object["alpha"]);
		this.position = FSArray.deserialize<THREE.Vector2>(object["position"]);
		this.invisible = FSArray.deserialize<boolean>(this.position != null && object["invisible"] == null ? [false] : object["invisible"]);
		for (var child of object["children"]) {
			let childNode = new Node_(child, this);
			this.addChild(childNode);
		}
	}

	private applyToTree(func, arg) {
		for (let child of this.children) {
			child.applyToTree(func, arg);
		}
		func.call(this, arg);
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

	public has(i: number): boolean {
		return this.array[i] != null
	}

	public clear(i: number) {
		this.array[i] = null;
	}

	public serialize(): T[] {
		return this.array;
	}

	static deserialize<T>(array: T[]): FSArray<T> {
		if (array == null)
			return null;
		let retObject = new FSArray<T>(null);
		retObject.array = array;
		return retObject;
	}

}

enum NodeMode {
	Edit,
	Play
}

