/// <reference path="renderer.ts" />
/// <reference path="./figures/node.ts" />
/// <reference path="./figures/ifigure.ts" />
var Player = (function () {
    function Player(renderer) {
        this.delay = 1000 / 30;
        this.stopSignal = false;
        this.loops = false;
        this.startFrame = 1;
        this.stopFrame = 100;
        this.renderer = renderer;
    }
    Player.prototype.play = function (figures, callback) {
        this.setMode(figures, NodeMode.Play);
        this._play(this.startFrame, figures, callback)();
    };
    Player.prototype.stop = function () {
        this.stopSignal = true;
    };
    Player.prototype.loop = function (loops) {
        this.loops = loops;
    };
    Player.prototype.setStartFrame = function (startFrame) {
        this.startFrame = startFrame;
    };
    Player.prototype.setStopFrame = function (stopFrame) {
        this.stopFrame = stopFrame;
    };
    Player.prototype._play = function (frame, figures, callback) {
        var that = this;
        return function () {
            if ((frame > that.stopFrame && !that.loops) || that.stopSignal) {
                that.setMode(figures, NodeMode.Edit);
                callback();
                that.stopSignal = false;
                return;
            }
            else if (frame > that.stopFrame)
                frame = that.startFrame;
            setTimeout(that._play(frame + 1, figures, callback), that.delay);
            for (var _i = 0, figures_1 = figures; _i < figures_1.length; _i++) {
                var figure = figures_1[_i];
                figure.getRoot().draw(Math.round(frame));
            }
            that.renderer.update();
        };
    };
    Player.prototype.setFPS = function (value) {
        this.delay = 1000 / value;
    };
    Player.prototype.setMode = function (figures, mode) {
        for (var _i = 0, figures_2 = figures; _i < figures_2.length; _i++) {
            var figure = figures_2[_i];
            figure.getRoot().setMode(mode);
        }
    };
    return Player;
}());
