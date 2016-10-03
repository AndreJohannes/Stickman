/// <reference path="../definitions/three.d.ts" />


namespace TextureHandler {


	export enum Texture {
		Stickman1,
		Background
	}

	let texture = function() {
		var retValue = {};
		retValue[Texture.Stickman1] = (new THREE.TextureLoader()).load("images/stickman1.png");
		retValue[Texture.Background] = (new THREE.TextureLoader()).load("images/cola.png");
		return retValue;
	} ();

	export function getTexture(tex: Texture) {

		return texture[tex];


	}

}