/// <reference path="../definitions/three.d.ts" />
/// <reference path="../sticky.ts" />
var TextureHandler = (function () {
    function TextureHandler(controller) {
        this.textures = {};
        this.controller = controller;
    }
    TextureHandler.prototype.getTexture = function (uuid) {
        if (uuid in this.textures) {
            return this.textures[uuid];
        }
        var src = this.controller.getProject().getImages()[uuid];
        var image = new Image();
        image.src = src;
        var texture = new THREE.Texture(image);
        texture.needsUpdate = true;
        this.textures[uuid] = texture;
        return texture;
    };
    TextureHandler.Stickman = (new THREE.TextureLoader()).load("images/stickman1.png");
    TextureHandler.Man = (new THREE.TextureLoader()).load("images/man.png");
    return TextureHandler;
}());
