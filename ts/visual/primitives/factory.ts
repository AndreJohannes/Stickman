/// <reference path="./head.ts" />
/// <reference path="./rectangle.ts" />

interface IPrimitives{

	getObject(): THREE.Object3D;
	setLength(lenght: number);
	serialize();

}

module Primitives {

    var getArgs = function(args, name: string, dflt: any): any {
		if (args[name.toLowerCase()] != null)
			return args[name.toLowerCase()]
		return dflt;
	}

	export function getPrimitive(type: string, args): IPrimitives {
		switch (type.toLowerCase()) {
			case "head":
				var size = getArgs(args, "size", 50);
				var phantom = getArgs(args, "phantom", false);
				return new Head(size, phantom);
			case "rectangle":
				return new Rectangle(null);
			default:
				// code...
				break;
		}


	}

	
}