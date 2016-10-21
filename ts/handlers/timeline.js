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
    }
    TimelineHandler.prototype.update = function () {
        this.makeTimeline();
        for (var i = 1; i <= this.max_frame; i++) {
            this.updateFrame(i);
        }
    };
    TimelineHandler.prototype.setFrame = function (frame) {
        $("#timeline th").css("background-color", "");
        $("#timeline th").eq(frame).css("background-color", "red");
        // TODO: if the current frame is close to the max frame, add more frames to the timeline
    };
    TimelineHandler.prototype.updateFrame = function (frame) {
        if (frame == null) {
            for (var i = 1; i <= this.max_frame; i++) {
                this.updateFrame(i);
            }
        }
        else {
            $.each(this.controller.getProject().getFigures(), function (index, value) {
                var div = $("#timeline tr").eq(index + 1).find("td").eq(frame).find("div");
                div.removeClass();
                if (value.getRoot()["invisible"].get(frame)) {
                    div.addClass("brick brick-nv");
                }
                else if (!value.getRoot()["position"].has(frame)) {
                    div.addClass("brick brick-nd");
                }
                else {
                    div.addClass("brick");
                }
            });
        }
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
    //private getRightClickFunction(frame: number, idxY: number) {
    //	var that = this;
    //	return function(event) {
    //		$("#contextMenuTimeline").show().css("left", event.clientX).css("top", event.clientY);;
    //		that.controller.getProject().getFigures()[frame].getRoot().release(frame);
    //	}
    //}
    TimelineHandler.prototype.makeTimeline = function () {
        var $thead = $("#tblTimeline thead");
        var $tbody = $("#tblTimeline tbody");
        var that = this;
        $thead.empty();
        $tbody.empty();
        $thead.append($("<tr>"));
        var figures = this.controller.getProject().getFigures();
        for (var i = 0; i < figures.length; i++) {
            var $tr = $("<tr>");
            $tbody.append($tr);
        }
        $thead.find("tr").append($("<th>"));
        $tbody.find("tr").each(function (index, item) {
            var $td = $("<td><div>" + figures[index].getName() + "</div></td>");
            $(this).append($td);
            $td.dblclick(that.getChangeNameFunction(index));
        });
        var _loop_1 = function() {
            var frame = i;
            var $th = $("<th>" + frame + "</th>");
            $th.click(this_1.getClick(frame));
            $thead.find("tr").append($th);
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
                    var isInvisible = root["invisible"].get(frame);
                    $ctm.append(that.getContextMenuElement("change tie", function () { isTied ? root.release(frame) : root.manifest(frame); that.updateFrame(frame); $ctm.hide(); }));
                    $ctm.append(that.getContextMenuElement("change visibility", function () { root["invisible"].set(frame, !isInvisible); that.updateFrame(null); $ctm.hide(); }));
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
    //////////////////////
    /// Auxiliary functions
    //////////////////////
    TimelineHandler.prototype.getContextMenuElement = function (text, callback) {
        var $a = $("<a>");
        var $li = $("<li>");
        $a.text(text);
        $a.click(callback);
        $li.append($a);
        return $li;
    };
    TimelineHandler.prototype.getChangeNameFunction = function (index) {
        var that = this;
        var figure = that.controller.getProject().getFigures()[index];
        return function (event) {
            var $td = $(this);
            $td.empty();
            var $input = $("<input>");
            $input.val(figure.getName());
            $td.append($input);
            $input.keypress(function (event) {
                if (event.which == 13) {
                    $td.empty();
                    var name_1 = $(this).val();
                    figure.setName(name_1);
                    $td.append($("<div>" + figure.getName() + "</div>"));
                }
            });
        };
    };
    return TimelineHandler;
}());
