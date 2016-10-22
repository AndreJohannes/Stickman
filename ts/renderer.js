/// <reference path="./definitions/three.d.ts" />
var GLRenderer = (function () {
    function GLRenderer() {
        this.resolution = [800, 600]; //[1280, 720]
        var that = this;
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-this.resolution[0] / 2, this.resolution[0] / 2, this.resolution[1] / 2, -this.resolution[1] / 2);
        this.camera.position.z = 1024 / 2;
        var geometry = new THREE.PlaneGeometry(4096, 4096); //THREE.BoxGeometry( 200, 1024, 200 );
        var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        this.background = new THREE.Mesh(geometry, material);
        this.scene.add(this.background);
        this.renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, alpha: false, antialias: false });
        //this.renderer.setClearColor(0xffffff, 0)
        this.renderer.setSize(this.resolution[0], this.resolution[1]);
        GLRenderer.heartbeat(this)();
    }
    GLRenderer.prototype.addObject = function (object) {
        this.scene.add(object);
    };
    GLRenderer.prototype.clearScene = function () {
        while (this.scene.children.length > 0) {
            this.scene.children.pop();
        }
        this.scene.add(this.background);
    };
    GLRenderer.prototype.getDom = function () {
        return this.renderer.domElement;
    };
    GLRenderer.prototype.resize = function (size) {
        if (this.resolution[0] != size[0] || this.resolution[1] != size[1]) {
            this.resolution = size;
            this.camera = new THREE.OrthographicCamera(-this.resolution[0] / 2, this.resolution[0] / 2, this.resolution[1] / 2, -this.resolution[1] / 2);
            this.camera.position.z = 1024 / 2;
            this.renderer.setSize(size[0], size[1]);
        }
    };
    GLRenderer.prototype.animate = function () {
        GLRenderer._animate(this)();
    };
    GLRenderer.prototype.update = function () {
        if (this.renderer != null) {
            this.renderer.render(this.scene, this.camera);
        }
    };
    GLRenderer._animate = function (render) {
        return function () {
            requestAnimationFrame(GLRenderer._animate(render));
            render.render();
        };
    };
    GLRenderer.heartbeat = function (renderer) {
        return function () {
            setTimeout(GLRenderer.heartbeat(renderer), 2000);
            if (renderer.renderer != null) {
                renderer.renderer.render(renderer.scene, renderer.camera);
            }
        };
    };
    GLRenderer.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    GLRenderer.webgl_support = function () {
        var retValue = false;
        try {
            var canvas = document.createElement("canvas");
            retValue = !!window["WebGLRenderingContext"] != null &&
                (canvas.getContext("webgl") != null ||
                    canvas.getContext("experimental-webgl")) != null;
        }
        catch (e) {
            return false;
        }
        return retValue;
    };
    return GLRenderer;
}());
