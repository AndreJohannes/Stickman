/// <reference path="definitions/jquery.d.ts" />
/// <reference path="renderer.ts" />
/// <reference path="./figures/node.ts" />

class Player {

	private renderer: GLRenderer;

	constructor(renderer: GLRenderer) {
		this.renderer = renderer;
	}

	public play(nodes: Node_[]) {
		this._play(1, 50, nodes)();
	}

	private _play(frame: number, stopFrame: number, nodes: Node_[]) {
		var that = this;
		return function() {
			if (frame > stopFrame)
				return;
			setTimeout(that._play(frame + 1, stopFrame, nodes), 33);
			for (let node of nodes) {
				node.draw(frame);
			}
			that.renderer.update();
		}
	}

}