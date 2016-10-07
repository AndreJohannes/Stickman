/// <reference path="renderer.ts" />
/// <reference path="./figures/node.ts" />
/// <reference path="./figures/ifigure.ts" />

class Player {

	private renderer: GLRenderer;

	constructor(renderer: GLRenderer) {
		this.renderer = renderer;
	}

	public play(figures: IFigure[], callback) {
		this.setMode(figures, NodeMode.Play);
		this._play(1, 100, figures, callback)();
	}

	private _play(frame: number, stopFrame: number, figures: IFigure[], callback) {
		var that = this;
		return function() {
			if (frame > stopFrame){
				that.setMode(figures, NodeMode.Edit);
				callback();
				return;
			}
			setTimeout(that._play(frame + 1, stopFrame, figures, callback), 33);
			for (let figure of figures) {
				figure.getRoot().draw(Math.round(frame / 1));
			}
			that.renderer.update();
		}
	}

	public setMode(figures: IFigure[], mode : NodeMode){
		for(let figure of figures){
			figure.getRoot().setMode(mode);
		}
	}

}