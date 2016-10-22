/// <reference path="../definitions/three.d.ts" />
/// <reference path="../visual/dots.ts" />
/// <reference path="./primitives/factory.ts" />
/// <reference path="../figures/node.ts" />
/// <reference path="../visual/primitives/link.ts" />

class VElement {

	private principal: THREE.Object3D;
	private primitive: THREE.Object3D;
	private offset: THREE.Object3D;
	private link: THREE.Object3D;
	private children: THREE.Object3D;
	private dot: THREE.Object3D;
	private dot_active: THREE.Object3D;

	constructor(length: number) {
		this.principal = new THREE.Object3D();
		this.offset = new THREE.Object3D();
		this.primitive = new THREE.Object3D();
		this.link = new VLink(length);
		this.children = new THREE.Object3D();
		this.offset.position.set(0, length, 0);
		this.dot = new Dot(Color.Blue).getObject();
		this.dot_active = new Dot(Color.Red).getObject();
		this.principal.add(this.offset);
		this.principal.add(this.primitive);
		this.principal.add(this.link);
		this.offset.add(this.dot);
		this.offset.add(this.dot_active);
		this.offset.add(this.children);
	}

	public setPosition(x: number, y: number) {
		this.principal.position.set(x, y, 0);
	}

	public SetRotation(alpha: number){
		this.principal.rotation.set(0,0, alpha);
	}

	public addChild(child: VElement) {
		this.children.add(child.principal);
	}

	public setPrimitive(object: IPrimitives) {
		this.primitive.add(object.getObject());
	}

	public getPrincipal(): THREE.Object3D{
		return this.principal;
	}

}


class Visual {

	private primary: VElement;
	private secondary: VElement;
	//private primaryPrimitive: IPrimitives;
	//private secondaryPrimitive: IPrimitives;
	//private dot: THREE.Object3D;
	//private dot_active: THREE.Object3D;
	private isVisual: Boolean = true;
	private mode: NodeMode = NodeMode.Edit;

	constructor(length: number) {
		this.primary =new VElement(length);
		this.secondary = new VElement(length);
	}

	public setMode(mode: NodeMode) {
		switch (mode) {
			case NodeMode.Play:
				//this.secondary.visible = false;
				//this.primary.visible = true;
				//this.dot.visible = false;
				//this.dot_active.visible = false;
				break;
			case NodeMode.Edit:
				//this.secondary.visible = true;
				//this.primary.visible = true;
				//this.dot.visible = true;
				//this.dot_active.visible = false;
				break;
		}
	}

	public activate() {
		//this.dot_active.visible = true;
	}

	public deactivate() {
		//this.dot_active.visible = false;
	}

	public rotate(x: number, secondary?: boolean) {
		if (secondary)
			this.secondary.SetRotation(x);
		else
			this.primary.SetRotation(x);
	}

	public position(x: number, y: number, secondary?: Boolean) {
		if (secondary)
			this.secondary.setPosition(x, y);
		else
			this.primary.setPosition(x, y);
	}
	
	public getPrimary(): THREE.Object3D {
		return this.primary.getPrincipal();
	}

	public getSecondary(): THREE.Object3D {
		return this.secondary.getPrincipal();
	}

	//public showSecondary(show: boolean) {
	//	this.secondary.visible = show;
	//}

	public add(visual: Visual) {
		this.primary.addChild(visual.primary);
		this.secondary.addChild(visual.secondary);
	}

	public addPrimary(object: IPrimitives) {
		this.primary.setPrimitive(object);
		//this.primaryPrimitive = object;
	}

	public addSecondary(object: IPrimitives) {
		this.secondary.setPrimitive(object);
		//this.secondaryPrimitive = object;
	}

	//public setLength(length: number) {
	//	this.primaryPrimitive.setLength(length);
	//	this.secondaryPrimitive.setLength(length);
	//}

	public serialize() {
		//return {
		//	"primary": this.primaryPrimitive != null ? this.primaryPrimitive.serialize() : null,
		//	"secondary": this.secondaryPrimitive != null ? this.secondaryPrimitive.serialize() : null
		//};
	}

	static deserialize(object): Visual {
		return null;
		//let retObject = new Visual();
		//if (object["primary"] != null)
		//	retObject.addPrimary(Primitives.getPrimitive(object["primary"]["name"], object["primary"]));
		//if (object["secondary"] != null)
		//	retObject.addSecondary(Primitives.getPrimitive(object["secondary"]["name"], object["secondary"]));
		//return retObject;
	}

}