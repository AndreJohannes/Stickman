/// <reference path="../definitions/three.d.ts" />
var TextureHandler;
(function (TextureHandler) {
    (function (Texture) {
        Texture[Texture["Stickman1"] = 0] = "Stickman1";
        Texture[Texture["Background"] = 1] = "Background";
    })(TextureHandler.Texture || (TextureHandler.Texture = {}));
    var Texture = TextureHandler.Texture;
    var texture = function () {
        var retValue = {};
        var image = new Image();
        image.src = "images/man.png";
        var texture = new THREE.Texture(image);
        texture.needsUpdate = true;
        retValue[Texture.Stickman1] = (new THREE.TextureLoader()).load("images/stickman1.png");
        retValue[Texture.Background] = texture; //(new THREE.TextureLoader()).load("images/cola.png");
        return retValue;
    }();
    function getTexture(tex) {
        return texture[tex];
    }
    TextureHandler.getTexture = getTexture;
})(TextureHandler || (TextureHandler = {}));
