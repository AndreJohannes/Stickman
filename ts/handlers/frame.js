/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../figures/ifigure.ts" />
var FrameHandler = (function () {
    function FrameHandler() {
        this.$btnUp = $("#btnFrameUp");
        this.$btnDown = $("#btnFrameDown");
        this.$iptFrame = $("#iptFrame");
        this.frame = 1;
        this.callbacks = [];
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
    FrameHandler.prototype.addCallback = function (cb) {
        this.callbacks.push(cb);
    };
    FrameHandler.prototype.getFrame = function () {
        return this.frame;
    };
    FrameHandler.prototype.setFrame = function (frame) {
        this._setFrame(frame);
    };
    FrameHandler.prototype._setFrame = function (frame) {
        this.frame = frame > 0 ? frame : this.frame;
        this.$iptFrame.val(this.frame);
        for (var _i = 0, _a = this.callbacks; _i < _a.length; _i++) {
            var callback = _a[_i];
            callback(this.frame);
        }
    };
    return FrameHandler;
}());
