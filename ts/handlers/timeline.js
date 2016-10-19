/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../project/project.ts" />
/// <reference path="../sticky.ts" />
var TimelineHandler = (function () {
    function TimelineHandler(controller) {
        this.max_frame = 99;
        this.controller = controller;
        this.$timeline = $("#timeline");
        this.$trFirst = this.$timeline.find("tr").first();
        this.$table = this.$timeline.find("table");
        this.makeTimeline();
        for (var i = 1; i <= this.max_frame; i++) {
            this.updateFrame(i);
        }
    }
    TimelineHandler.prototype.update = function () {
        this.makeTimeline();
    };
    TimelineHandler.prototype.setFrame = function (frame) {
        $("#timeline th").css("background-color", "");
        $("#timeline th").eq(frame).css("background-color", "red");
        // TODO: if the current frame is close to the max frame, add more frames to the timeline
    };
    TimelineHandler.prototype.updateFrame = function (frame) {
        $.each(this.controller.getProject().getFigures(), function (index, value) {
            var div = $("#timeline tr").eq(index + 1).find("td").eq(frame - 1).find("div");
            if (value.getRoot()["position"].has(frame)) {
                div.removeClass("brick-nd");
            }
            else {
                div.addClass("brick-nd");
            }
        });
    };
    TimelineHandler.prototype.getClick = function (frame) {
        var that = this;
        return function () {
            that.controller.updateFrame(frame);
        };
    };
    TimelineHandler.prototype.addFrames = function (count) {
        var $trList = $("#timeline tr").not(":first");
        for (var i = this.max_frame + 1; i <= this.max_frame + count; i++) {
            var $th = $("<th/>");
            $th.text(i);
            this.$trFirst.append($th);
            $.each(this.controller.getProject().getFigures(), function (index, figure) {
                var $td = $("<td><div class=\"brick\"></div></td>");
                $trList.eq(index).append($td);
            });
            this.updateFrame(i);
        }
        this.max_frame += count;
    };
    TimelineHandler.prototype.getRightClickFunction = function (frame, idxY) {
        var that = this;
        return function (event) {
            $("#contextMenuTimeline").show().css("left", event.clientX).css("top", event.clientY);
            ;
            that.controller.getProject().getFigures()[frame].getRoot().release(frame);
        };
    };
    TimelineHandler.prototype.makeTimeline = function () {
        var $thead = $("#tblTimeline thead");
        var $tbody = $("#tblTimeline tbody");
        $thead.empty();
        $tbody.empty();
        $thead.append($("<tr>"));
        var figures = this.controller.getProject().getFigures();
        for (var i = 0; i < figures.length; i++) {
            var $tr = $("<tr>");
            $tbody.append($tr);
        }
        $thead.find("tr").append($("<th>"));
        $tbody.find("tr").each(function (index, item) { $(this).append($("<div>" + figures[index].getName() + "</div>")); });
        var _loop_1 = function() {
            var frame = i;
            var $th = $("<th>" + frame + "</th>");
            $th.click(this_1.getClick(frame));
            $thead.find("tr").append($th);
            var that = this_1;
            $tbody.find("tr").each(function (index, item) {
                var $td = $("<td>");
                var $div = $("<div class=\"brick\">");
                $td.append($div);
                $(this).append($td);
                $td.mouseenter(function () { $(this).addClass("timeline-highlight"); });
                $td.mouseleave(function () { $(this).removeClass("timeline-highlight"); });
                //$td.click(function(){ figures[index].getRoot().manifest(cframe);;that.updateFrame(cframe);});
                $td.bind("contextmenu", function (event) {
                    var $ctm = $("#contextMenuTimeline");
                    $ctm.empty();
                    var root = that.controller.getProject().getFigures()[index].getRoot();
                    var isTied = root["position"].has(frame);
                    $ctm.append(that.getContextMenuElement("change tie", function () { isTied ? root.release(frame) : root.manifest(frame); that.updateFrame(frame); $ctm.hide(); }));
                    $ctm.show().css("left", event.clientX).css("top", event.clientY);
                    ;
                    return false;
                });
            });
        };
        var this_1 = this;
        for (var i = 1; i <= this.max_frame; i++) {
            _loop_1();
        }
    };
    // Auxiliary functions
    TimelineHandler.prototype.getContextMenuElement = function (text, callback) {
        var $a = $("<a>");
        var $li = $("<li>");
        $a.text(text);
        $a.click(callback);
        $li.append($a);
        return $li;
    };
    return TimelineHandler;
}());
