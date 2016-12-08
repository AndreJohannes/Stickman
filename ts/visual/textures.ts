/// <reference path="../definitions/three.d.ts" />
/// <reference path="../sticky.ts" />

module TextureHandler {

	class TextureHandler {

		public static Stickman: THREE.Texture = (new THREE.TextureLoader()).load("images/stickman1.png");
		public static Man: THREE.Texture = (new THREE.TextureLoader()).load("images/man.png");

		private textures: Object = {};
		private controller: Sticky;

		constructor(controller: Sticky) {
			this.controller = controller;
		}

		public getTexture(uuid: string): THREE.Texture {
			if (uuid in this.textures) {
				return this.textures[uuid];
			}
			let src: string = this.controller.getProject().getImages()[uuid];
			var image = new Image();
			image.src = src;
			var texture = new THREE.Texture(image);
			texture.uuid = uuid; // we use out uuid
			texture.needsUpdate = true;
			this.textures[uuid] = texture;
			return texture;
		}

	}

	let _instance;

	export let getInstance = function(controller?: Sticky):TextureHandler {
		if(_instance==null && controller==null)
			throw new Error("Need to pass the controller");
		if(_instance==null)
			_instance = new TextureHandler(controller);
		return _instance;
	}

	export let Stickman = TextureHandler.Stickman;
	export let Man = TextureHandler.Man;

}