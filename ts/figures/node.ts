/// <reference path="../definitions/three.d.ts" />
/// <reference path="../primitives/visual.ts" />

class Node_ {

	private _isRoot: Boolean;
	private position: FSArray<THREE.Vector2>;
	private parent_: Node_;
	private length: number;
	private alpha: FSArray<number>;
	private children: Node_[] = [];
	private visual: Visual;

	constructor(pointOrLength?: any, alpha?: number) { // TypeScripts way of constructor overloading
		if (pointOrLength.isVector2 == true) {
			this.position = new FSArray(pointOrLength);
			this._isRoot = true;
			this.alpha = null;
			this.visual = new Visual();
		} else {
			this.length = pointOrLength;
			this.alpha = new FSArray(alpha);
			this._isRoot = false;
			this.visual = new Visual();
			this.visual.rotate(alpha);
			this.visual.setDotPosition(0, this.length);
		}
	}

	public isRoot(): Boolean {
		return this._isRoot;
	}

	public draw(frame: number) {
		if (this._isRoot) {
			var position = this.position.get(frame);
			this.visual.position.set(position.x, -position.y, 0);
		}
		else
			this.visual.rotate(this.alpha.get(frame));
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

	public addVisual(visual: THREE.Object3D) {
		if (this.parent_ != null && this.parent_.visual != null) {
			//this.parent_._addVisual(visual);
			this.visual.add(visual);
			//this.visual.rotation.set(0, 0, this.alpha);
		}
	}

	public getVisual(): THREE.Object3D {
		return this.visual;
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

	private _addVisual(visual: THREE.Object3D) {
		if (this._isRoot) {
			this.visual.add(visual);
		} else {
			var object = new THREE.Object3D();
			object.position.set(0, this.length, 0);
			object.add(visual);
			this.visual.add(object);
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

}

