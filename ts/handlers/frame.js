/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../sticky.ts" />
var FrameHandler = (function () {
    function FrameHandler(controller) {
        this.$btnUp = $("#btnFrameUp");
        this.$btnDown = $("#btnFrameDown");
        this.$iptFrame = $("#iptFrame");
        this.frame = 1;
        this.controller = controller;
        this.$btnUp = $("#btnFrameUp");
        this.$btnDown = $("#btnFrameDown");
        this.$iptFrame = $("#iptFrame");
        var that = this;
        this.$btnUp.click(function () { that._setFrame(that.frame + 1); });
        this.$btnDown.click(function () { that._setFrame(that.frame - 1); });
        this.$iptFrame.change(function () {
            var val = this.$iptFrame.val();
            if ($.isNumeric(val)) {
                that._setFrame(Math.round(val));
            }
        });
    }
    FrameHandler.prototype.getFrame = function () {
        return this.frame;
    };
    FrameHandler.prototype.setFrame = function (frame) {
        this.frame = frame > 0 ? frame : this.frame;
        this.$iptFrame.val(this.frame);
    };
    FrameHandler.prototype._setFrame = function (frame) {
        this.frame = frame > 0 ? frame : this.frame;
        this.controller.updateFrame(this.frame);
        this.$iptFrame.val(this.frame);
    };
    return FrameHandler;
}());
