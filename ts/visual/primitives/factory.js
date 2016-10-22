/// <reference path="./head.ts" />
/// <reference path="./rectangle.ts" />
var Primitives;
(function (Primitives) {
    var getArgs = function (args, name, dflt) {
        if (args[name.toLowerCase()] != null)
            return args[name.toLowerCase()];
        return dflt;
    };
    function getPrimitive(type, args) {
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
    Primitives.getPrimitive = getPrimitive;
})(Primitives || (Primitives = {}));
