/// <reference path="./definitions/three.d.ts" />


class GLRenderer {

	private scene: THREE.Scene;
	private camera: THREE.Camera;
	private renderer: THREE.Renderer;
	private background: THREE.Object3D;

	private resolution: number[] = [800, 600]//[1280, 720]

	constructor() {

		var that = this;
		this.scene = new THREE.Scene();
		this.camera = new THREE.OrthographicCamera(-this.resolution[0] / 2, this.resolution[0] / 2, this.resolution[1] / 2, -this.resolution[1] / 2);
		this.camera.position.z = 1024 / 2;

		var geometry: THREE.Geometry = new THREE.PlaneGeometry(4096, 4096);//THREE.BoxGeometry( 200, 1024, 200 );
		var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
		this.background = new THREE.Mesh(geometry, material);
		this.scene.add(this.background);

		this.renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, alpha: false, antialias: false });
		//this.renderer.setClearColor(0xffffff, 0)
		this.renderer.setSize(this.resolution[0], this.resolution[1]);

		GLRenderer.heartbeat(this)();

	}

	public addObject(object: THREE.Object3D) {
		this.scene.add(object);
	}

	public clearScene() {
		while (this.scene.children.length > 0) {
			this.scene.children.pop();
		}
		this.scene.add(this.background);
	}

	public getDom() {
		return this.renderer.domElement;
	}

	public resize(size: number[]) {
		if (this.resolution[0] != size[0] || this.resolution[1] != size[1]) {
			this.resolution = size;
			this.camera = new THREE.OrthographicCamera(-this.resolution[0] / 2, this.resolution[0] / 2, this.resolution[1] / 2, -this.resolution[1] / 2);
			this.camera.position.z = 1024 / 2;
			this.renderer.setSize(size[0], size[1]);
		}
	}

	public animate() {
		GLRenderer._animate(this)();
	}


	public update() {
		if (this.renderer != null) {
			this.renderer.render(this.scene, this.camera);
		}
	}

	private static _animate(render: GLRenderer) {
		return function() {
			requestAnimationFrame(GLRenderer._animate(render));
			render.render();
		}
	}


	private static heartbeat(renderer: GLRenderer) {
		return function() {
			setTimeout(GLRenderer.heartbeat(renderer), 2000);
			if (renderer.renderer != null) {
				renderer.renderer.render(renderer.scene, renderer.camera);
			}
		}
	}

	private render() {
		this.renderer.render(this.scene, this.camera);
	}

	public static webgl_support() {
		var retValue: Boolean = false;
		try {
			var canvas = document.createElement("canvas");
			retValue = !!window["WebGLRenderingContext"] != null &&
				(canvas.getContext("webgl") != null ||
					canvas.getContext("experimental-webgl")) != null;
		} catch (e) {
			return false;
		}
		return retValue;
	}
}
