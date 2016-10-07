/// <reference path="renderer.ts" />
/// <reference path="./figures/node.ts" />
/// <reference path="./figures/ifigure.ts" />
var Player = (function () {
    function Player(renderer) {
        this.renderer = renderer;
    }
    Player.prototype.play = function (figures, callback) {
        this.setMode(figures, NodeMode.Play);
        this._play(1, 100, figures, callback)();
    };
    Player.prototype._play = function (frame, stopFrame, figures, callback) {
        var that = this;
        return function () {
            if (frame > stopFrame) {
                that.setMode(figures, NodeMode.Edit);
                callback();
                return;
            }
            setTimeout(that._play(frame + 1, stopFrame, figures, callback), 33);
            for (var _i = 0, figures_1 = figures; _i < figures_1.length; _i++) {
                var figure = figures_1[_i];
                figure.getRoot().draw(Math.round(frame / 1));
            }
            that.renderer.update();
        };
    };
    Player.prototype.setMode = function (figures, mode) {
        for (var _i = 0, figures_2 = figures; _i < figures_2.length; _i++) {
            var figure = figures_2[_i];
            figure.getRoot().setMode(mode);
        }
    };
    return Player;
}());
