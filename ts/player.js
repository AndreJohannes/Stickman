/// <reference path="definitions/jquery.d.ts" />
/// <reference path="renderer.ts" />
/// <reference path="./figures/node.ts" />
var Player = (function () {
    function Player(renderer) {
        this.renderer = renderer;
    }
    Player.prototype.play = function (nodes) {
        this._play(1, 100, nodes)();
    };
    Player.prototype._play = function (frame, stopFrame, nodes) {
        var that = this;
        return function () {
            if (frame > stopFrame)
                return;
            setTimeout(that._play(frame + 1, stopFrame, nodes), 33);
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                node.draw(Math.round(frame / 2));
            }
            that.renderer.update();
        };
    };
    return Player;
}());
