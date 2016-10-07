/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../figures/ifigure.ts" />

class TimelineHandler {

	private callbacks: Function[];
	private $timeline: JQuery;
	private $trFirst: JQuery;
	private $table: JQuery;
	private figures: IFigure[];
	private max_frame = 50;

	constructor(figures: IFigure[]) {
		this.callbacks = [];
		this.figures = figures
		this.$timeline = $("#timeline");
		this.$trFirst = this.$timeline.find("tr").first();
		this.$table = $("table");
		let trList = [];
		for (i = 0; i < figures.length; i++) {
			var $tr = $("<tr></tr>");
			trList.push($tr);
			this.$table.append($tr);
		}
		for (var i = 1; i <= this.max_frame; i++) {
			var $th = $("<th>" + i + "</th>");
			$th.data("index", i);
			$th.click(this.getClick());
			this.$trFirst.append($th);
			for (let $tr of trList) {
				var $td = $("<td><div class=\"brick\"></div></td>");
				$tr.append($td);
			}
		}
		for (var i = 1; i <= this.max_frame; i++) {
			this.updateFrame(i);
		}
	}

	public setFrame(frame: number) {
		$("th").css("background-color", "");
		$("th").eq(frame - 1).css("background-color", "red");
		// TODO: if the current frame is close to the max frame, add more frames to the timeline
	}

	public addCallback(cb) {
		this.callbacks.push(cb);
	}

	public updateFrame(frame){
		$.each(this.figures, function(index, value){
			var div = $("tr").eq(index + 1).find("td").eq(frame-1).find("div");
			if(value.getRoot()["position"].has(frame)){
				div.removeClass("brick-nd");
			}else{
				div.addClass("brick-nd");
			}
		})		
	}

	private getClick(): Function {
		let that = this;
		return function() {
			var frame = $(this).data("index");
			$("th").css("background-color", "");
			$(this).css("background-color", "red");
			for (let callback of that.callbacks) {
				callback(frame);
			}
		}
	}

	private addFrames(count: number){
		var $trList = $("tr").not(":first"); 
		for(var i=this.max_frame+1; i<=this.max_frame+count; i++){
			var $th = $("<th/>");
			$th.text(i);
			this.$trFirst.append($th);
			$.each(this.figures, function(index, figure){
				var $td = $("<td><div class=\"brick\"></div></td>");
				$trList.eq(index).append($td);
			});
			this.updateFrame(i);
		}
		this.max_frame += count;
	}

}