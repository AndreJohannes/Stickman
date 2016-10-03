/// <reference path="../definitions/three.d.ts" />
/// <reference path="../primitives/dots.ts" />

class Node_ {

	private _isRoot: Boolean;
	private position: THREE.Vector2;
	private parent_: Node_;
	private length: number;
	private alpha: number;
	private children: Node_[] = [];
	private visual: THREE.Object3D = new THREE.Object3D;
	private dot: THREE.Object3D = new Dot(Color.Blue).getObject();
	private dot_active: THREE.Object3D = new Dot(Color.Red).getObject();

	constructor(pointOrLength?: any, alpha?: number) { // TypeScripts way of constructor overloading
		if (pointOrLength.isVector2 == true) {
			this.position = pointOrLength;
			this._isRoot = true;
			this.alpha = 0;
		} else {
			this.length = pointOrLength;
			this.alpha = alpha;
			this.visual.rotation.set(0, 0, alpha);
			this._isRoot = false;
			this.dot.position.set(0, this.length, 0);
			this.dot_active.position.set(0, this.length, 0);
		}
		this.visual.add(this.dot);
		this.dot_active.visible = false;
		this.visual.add(this.dot_active);
	}

	public isRoot(): Boolean {
		return this._isRoot;
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
			this.parent_._addVisual(visual);
			this.visual.add(visual);
			//this.visual.rotation.set(0, 0, this.alpha);
		}
	}

	public getVisual(): THREE.Object3D {
		return this.visual;
	}

	public setAlpha(alpha: number) {
		if (this._isRoot)
			return;
		this.alpha = alpha;
		if (this.visual != null) {
			this.visual.rotation.set(0, 0, alpha);
		}
	}

	public setPosition(x: number, y: number) {
		if (this.isRoot) {
			this.position = new THREE.Vector2(x, y);
			this.visual.position.set(x, -y, 0);
		}
	}

	public getChild(idx: number) {
		return this.children[idx];
	}

	public getProximityNodes(radius: number, position: THREE.Vector2) {
		return this._getProximityNodes(radius, 0, position, new THREE.Vector2(0, 0));
	};

	public activate() {
		this.dot_active.visible = true;
	}

	public deactivate() {
		this.dot_active.visible = false;
	}

	private _getProximityNodes(radius: number, alpha: number, position: THREE.Vector2, anchor_position: THREE.Vector2) {
		let beta = alpha + this.alpha;
		let pos = this._isRoot ? this.position : new THREE.Vector2(-Math.sin(beta) * this.length, -Math.cos(beta) * this.length);
		let distance = position.distanceTo(pos);
		  var dic = { "distance": distance, "node": this, "pivot": anchor_position, "alpha": alpha };
		var retValue: any = distance < radius ? dic : null;
		let position_new = position.clone();
		position_new.sub(pos);
		let anchor_position_new = anchor_position.clone();
		anchor_position_new.add(pos);
		for (let node of this.children) {
			var childeNode = node._getProximityNodes(radius, beta, position_new, anchor_position_new);
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


