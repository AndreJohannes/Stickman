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
	private iPrimitive: IPrimitives;

	constructor(length: number, phantom: boolean) {
		this.principal = new THREE.Object3D();
		this.offset = new THREE.Object3D();
		this.primitive = new THREE.Object3D();
		this.link = new VLink(length, phantom);
		this.children = new THREE.Object3D();
		this.offset.position.set(0, length, 0);
		this.dot = new Dot(Color.Blue).getObject();
		this.dot_active = new Dot(Color.Red).getObject();
		this.principal.add(this.offset);
		this.principal.add(this.primitive);
		this.principal.add(this.link);
		this.offset.add(this.children);
		if (!phantom) {
			this.offset.add(this.dot);
			this.offset.add(this.dot_active);
		}
		
	}

	public setVisibility(value: boolean) {
		this.principal.visible = value;
	}

	public setLength(length: number){
		this.offset.position.set(0, length, 0);
		(<VLink>this.link).setLength(length);
	}

	public setPosition(x: number, y: number) {
		this.principal.position.set(x, y, 0);
	}

	public SetRotation(alpha: number) {
		this.principal.rotation.set(0, 0, alpha);
	}

	public addChild(child: VElement) {
		this.children.add(child.principal);
	}

	public setPrimitive(object: IPrimitives) {
		if (object == null)
			return;
		this.iPrimitive = object;
		this.primitive.add(object.getObject());
		this.link.visible = false;
	}

	public getPrincipal(): THREE.Object3D {
		return this.principal;
	}

	public getIPrimitive(): IPrimitives {
		return this.iPrimitive;
	}

	public showDots(value: boolean){
		this.dot.visible = value;
		this.dot_active.visible = value;
	}

}


class Visual {

	private primary: VElement;
	private secondary: VElement;
	//private primaryPrimitive: IPrimitives;
	//private secondaryPrimitive: IPrimitives;
	private isVisual: Boolean = true;
	private mode: NodeMode = NodeMode.Edit;

	constructor(length: number) {
		this.primary = new VElement(length, false);
		this.secondary = new VElement(length, true);
	}

	public setMode(mode: NodeMode) {
		switch (mode) {
			case NodeMode.Play:
				this.secondary.setVisibility(false);
				this.primary.setVisibility(true);
				this.primary.showDots(false);
				break;
			case NodeMode.Edit:
				this.secondary.setVisibility(true);
				this.primary.setVisibility(true);
				this.primary.showDots(true);
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

	public getPrimary(): VElement {
		return this.primary;
	}

	public getSecondary(): VElement {
		return this.secondary;
	}

	public displaySecondary(display: boolean) {
		this.secondary.setVisibility(display);
	}

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

	public setLength(length: number) {
		this.primary.setLength(length);
		this.secondary.setLength(length);
	}

	public serialize() {
		//return {
		//	"primary": this.primaryPrimitive != null ? this.primaryPrimitive.serialize() : null,
		//	"secondary": this.secondaryPrimitive != null ? this.secondaryPrimitive.serialize() : null
		//};
	}

	static deserialize(object): Visual {
		let retObject = object["primary"] != null ?new Visual(object["primary"].length) : new Visual(0);
		if (object["primary"] != null)
			retObject.addPrimary(Primitives.getPrimitive(object["primary"]["name"], object["primary"]));
		if (object["secondary"] != null)
			retObject.addSecondary(Primitives.getPrimitive(object["secondary"]["name"], object["secondary"]));
		return retObject;
	}

}