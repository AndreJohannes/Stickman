/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../project/project.ts" />
/// <reference path="../sticky.ts" />

class TimelineHandler {

	private $timeline: JQuery;
	private $trFirst: JQuery;
	private $table: JQuery;
	private controller: Sticky;
	private max_frame = 99;

	constructor(controller: Sticky) {
		this.controller = controller;
		this.$timeline = $("#timeline");
		this.$trFirst = this.$timeline.find("tr").first();
		this.$table = this.$timeline.find("table");

		this.makeTimeline();
		for (var i = 1; i <= this.max_frame; i++) {
			this.updateFrame(i);
		}
	}

	public update(){
		this.makeTimeline();
	}

	public setFrame(frame: number) {
		$("#timeline th").css("background-color", "");
		$("#timeline th").eq(frame).css("background-color", "red");
		// TODO: if the current frame is close to the max frame, add more frames to the timeline
	}

	public updateFrame(frame: number) {
		$.each(this.controller.getProject().getFigures(), function(index, value) {
			var div = $("#timeline tr").eq(index + 1).find("td").eq(frame - 1).find("div");
			if (value.getRoot()["position"].has(frame)) {
				div.removeClass("brick-nd");
			} else {
				div.addClass("brick-nd");
			}
		})
	}

	private getClick(frame: number): Function {
		let that = this;
		return function() {
			that.controller.updateFrame(frame);
		}
	}

	private addFrames(count: number) {
		var $trList = $("#timeline tr").not(":first");
		for (var i = this.max_frame + 1; i <= this.max_frame + count; i++) {
			var $th = $("<th/>");
			$th.text(i);
			this.$trFirst.append($th);
			$.each(this.controller.getProject().getFigures(), function(index, figure) {
				var $td = $("<td><div class=\"brick\"></div></td>");
				$trList.eq(index).append($td);
			});
			this.updateFrame(i);
		}
		this.max_frame += count;
	}

	private getRightClickFunction(frame: number, idxY: number) {
		var that = this;
		return function(event) {
			$("#contextMenuTimeline").show().css("left", event.clientX).css("top", event.clientY);;
			that.controller.getProject().getFigures()[frame].getRoot().release(frame);
		}
	}

	private makeTimeline() {
		let $thead = $("#tblTimeline thead");
		let $tbody = $("#tblTimeline tbody");
		$thead.empty(); $tbody.empty();
		$thead.append($("<tr>"));
		let figures: IFigure[] = this.controller.getProject().getFigures();

		for (var i = 0; i < figures.length; i++) {
			var $tr = $("<tr>"); $tbody.append($tr);
		}

		$thead.find("tr").append($("<th>"));
		$tbody.find("tr").each(function(index, item) { $(this).append($("<div>" + figures[index].getName() + "</div>")) });

		for (var i = 1; i <= this.max_frame; i++) {
			let frame = i;
			let $th = $("<th>" + frame + "</th>");
			$th.click(this.getClick(frame));
			$thead.find("tr").append($th);
			let that = this;
			$tbody.find("tr").each(function(index, item) {
				let $td = $("<td>");
				let $div = $("<div class=\"brick\">");
				$td.append($div);
				$(this).append($td);
				$td.mouseenter(function() { $(this).addClass("timeline-highlight") });
				$td.mouseleave(function() { $(this).removeClass("timeline-highlight") });
				//$td.click(function(){ figures[index].getRoot().manifest(cframe);;that.updateFrame(cframe);});
				$td.bind("contextmenu", function(event) {
					let $ctm = $("#contextMenuTimeline");
					$ctm.empty();
					let root: Node_ = that.controller.getProject().getFigures()[index].getRoot();
					let isTied: boolean = root["position"].has(frame);
					$ctm.append(that.getContextMenuElement("change tie", function() { isTied ? root.release(frame) : root.manifest(frame); that.updateFrame(frame); $ctm.hide();}));
					$ctm.show().css("left", event.clientX).css("top", event.clientY);;
					return false;
				});
			});

		}
	}


	// Auxiliary functions
	private getContextMenuElement(text: string, callback: Function): JQuery {
		let $a: JQuery = $("<a>");
		let $li: JQuery = $("<li>");
		$a.text(text);
		$a.click(callback);
		$li.append($a);
		return $li;
	}


}