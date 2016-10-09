/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/FileSaver.d.ts" />
/// <reference path="../definitions/jszip.d.ts" />
/// <reference path="../definitions/jquery.validation.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../project/storage.ts" />

class MenuHandler {

	private $open: JQuery;
	private $save: JQuery;
	private $export: JQuery;
	private project: Project;
	private projectStorage: ProjectStorage;
	private callbacks: Function[];

	constructor(project: Project) {
		var that = this;
		this.projectStorage = new ProjectStorage();
		this.project = project;

		this.$open = $("#btnOpen");
		this.$open.click(this.openProjectClick());

		this.$save = $("#btnSave");
		this.$save.click(this.saveProjectClick());

		this.$export = $("#mnuExport");
		this.$export.click(function() { that.export(); });

		this.callbacks = [];
	}

	public addCallback(cb: Function){

		this.callbacks.push(cb);

	}

	private export() {
		let data = this.project.serialize();
		var json = JSON.stringify(data);
		var blob = new Blob([json], { type: "text/json" });
		saveAs(blob, "test.json");
	}

	private openProjectClick() {
		var that = this;
		return function() {
			var $tbody = $("#tblProjectLoad tbody");
			$tbody.empty();
			var dic = that.projectStorage.getLocalStorageTOC()
			for (var name in dic) {
				var $tr = $("<tr>");
				$tr.append($.validator.format("<th>{0}</th><th>{1}</th>", name, dic[name]["date"]));
				$tr.click(function() {
					$tbody.find("tr").removeClass("success");
					$(this).addClass("success");
				})
				$tbody.append($tr);
			}
		}
	}

	private saveProjectClick() {
		var that = this;
		return function() {
			var $tbody = $("#tblProjectSave tbody");
			$tbody.empty();
			var dic = that.projectStorage.getLocalStorageTOC()
			for (var name in dic) {
				var $tr = $("<tr>");
				$tr.append($.validator.format("<th>{0}</th><th>{1}</th>",
					name, dic[name]["date"]));
				$tr.data("name", name);
				$tr.click(function() {
					$tbody.find("tr").removeClass("success");
					$(this).addClass("success");
					$("#iptProjectSave").val($(this).data("name"));
				})
				$tbody.append($tr);
			}
			$("#iptProjectSave").val(that.project.getName());
			$("#btnSaveProject").unbind();
			$("#btnSaveProject").click(function() {
				var name = $("#iptProjectSave").val();
				that.project["name"] = name;
				that.projectStorage.saveProjectToLocalStorage(that.project);
			});
		}
	}


}