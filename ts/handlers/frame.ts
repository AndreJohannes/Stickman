/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../sticky.ts" />

class FrameHandler {

	private controller: Sticky;
	private frame: number;
	private $btnUp: JQuery = $("#btnFrameUp");
	private $btnDown: JQuery = $("#btnFrameDown");
	private $iptFrame: JQuery = $("#iptFrame");

	constructor(controller: Sticky) {
		this.frame = 1;
		this.controller = controller;
		this.$btnUp = $("#btnFrameUp");
		this.$btnDown = $("#btnFrameDown");
		this.$iptFrame = $("#iptFrame");
		let that = this;
		this.$btnUp.click(function() { that._setFrame(that.frame + 1); });
		this.$btnDown.click(function() { that._setFrame(that.frame - 1); });
		this.$iptFrame.change(function() {
			var val = this.$iptFrame.val(); if ($.isNumeric(val))
			{ that._setFrame(Math.round(val)) }
		});
	}

	public getFrame() {
		return this.frame;
	}

	public setFrame(frame: number) {
		this.frame = frame > 0 ? frame : this.frame;
		this.$iptFrame.val(this.frame);
	}

	private _setFrame(frame: number) {
		this.frame = frame > 0 ? frame : this.frame;
		this.controller.updateFrame(this.frame);
		this.$iptFrame.val(this.frame);
	}

}