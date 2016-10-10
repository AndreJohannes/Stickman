/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../project/project.ts" />
var TimelineHandler = (function () {
    function TimelineHandler(project) {
        this.max_frame = 50;
        this.callbacks = [];
        this.project = project;
        this.$timeline = $("#timeline");
        this.$trFirst = this.$timeline.find("tr").first();
        this.$table = this.$timeline.find("table");
        var trList = [];
        for (i = 0; i < project.getFigures().length; i++) {
            var $tr = $("<tr></tr>");
            trList.push($tr);
            this.$table.append($tr);
        }
        for (var i = 1; i <= this.max_frame; i++) {
            var $th = $("<th>" + i + "</th>");
            $th.data("index", i);
            $th.click(this.getClick());
            this.$trFirst.append($th);
            for (var _i = 0, trList_1 = trList; _i < trList_1.length; _i++) {
                var $tr_1 = trList_1[_i];
                var $td = $("<td><div class=\"brick\"></div></td>");
                $tr_1.append($td);
            }
        }
        for (var i = 1; i <= this.max_frame; i++) {
            this.updateFrame(i);
        }
    }
    TimelineHandler.prototype.setFrame = function (frame) {
        $("#timeline th").css("background-color", "");
        $("#timeline th").eq(frame - 1).css("background-color", "red");
        // TODO: if the current frame is close to the max frame, add more frames to the timeline
    };
    TimelineHandler.prototype.addCallback = function (cb) {
        this.callbacks.push(cb);
    };
    TimelineHandler.prototype.updateFrame = function (frame) {
        $.each(this.project.getFigures(), function (index, value) {
            var div = $("#timeline tr").eq(index + 1).find("td").eq(frame - 1).find("div");
            if (value.getRoot()["position"].has(frame)) {
                div.removeClass("brick-nd");
            }
            else {
                div.addClass("brick-nd");
            }
        });
    };
    TimelineHandler.prototype.getClick = function () {
        var that = this;
        return function () {
            var frame = $(this).data("index");
            $("th").css("background-color", "");
            $(this).css("background-color", "red");
            for (var _i = 0, _a = that.callbacks; _i < _a.length; _i++) {
                var callback = _a[_i];
                callback(frame);
            }
        };
    };
    TimelineHandler.prototype.addFrames = function (count) {
        var $trList = $("#timeline tr").not(":first");
        for (var i = this.max_frame + 1; i <= this.max_frame + count; i++) {
            var $th = $("<th/>");
            $th.text(i);
            this.$trFirst.append($th);
            $.each(this.project.getFigures(), function (index, figure) {
                var $td = $("<td><div class=\"brick\"></div></td>");
                $trList.eq(index).append($td);
            });
            this.updateFrame(i);
        }
        this.max_frame += count;
    };
    return TimelineHandler;
}());
