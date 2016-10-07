/// <reference path="./definitions/three.d.ts" />
/// <reference path="./visual/primitives/limb.ts" />
var GLRenderer = (function () {
    function GLRenderer() {
        this.resolution = [1280, 720];
        var that = this;
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-this.resolution[0] / 2, this.resolution[0] / 2, this.resolution[1] / 2, -this.resolution[1] / 2);
        this.camera.position.z = 1024 / 2;
        var geometry = new THREE.PlaneGeometry(1280, 720); //THREE.BoxGeometry( 200, 1024, 200 );
        var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        //var object1 = (new Limb()).getObject();	
        //var object2 = (new Limb()).getObject();
        //object2.position.set(0,50,0);
        //object2.rotation.set(0,0,.2);
        //object1.rotation.set(0,0,.55);
        //object1.add(object2);
        //this.scene.add(object1);
        this.renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, alpha: false, antialias: false });
        //this.renderer.setClearColor(0xffffff, 0)
        this.renderer.setSize(this.resolution[0], this.resolution[1]);
        GLRenderer.heartbeat(this)();
    }
    GLRenderer.prototype.addObject = function (object) {
        this.scene.add(object);
    };
    GLRenderer.prototype.getDom = function () {
        return this.renderer.domElement;
    };
    GLRenderer.prototype.resize = function (x, y) {
        this.renderer.setSize(x, y);
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
