/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/FileSaver.d.ts" />
/// <reference path="../definitions/jszip.d.ts" />
/// <reference path="../definitions/jquery.validation.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../project/project.ts" />
/// <reference path="../project/storage.ts" />
/// <reference path="../sticky.ts" />

class MenuHandler {

	private $open: JQuery;
	private $save: JQuery;
	private $export: JQuery;
	private $import: JQuery;
	private $importImage: JQuery;
	private $addStickman: JQuery;
	private controller: Sticky;
	private projectStorage: ProjectStorage;

	constructor(controller: Sticky) {
		var that = this;
		this.projectStorage = new ProjectStorage();
		this.controller = controller;

		this.$open = $("#btnOpen");
		this.$open.click(this.openProjectClick());

		this.$save = $("#btnSave");
		this.$save.click(this.saveProjectClick());

		this.$export = $("#mnuExport");
		this.$export.click(function() { that.export(); });

		this.$import = $("#mnuImport");
		this.$import.click(function() { that.import(); });

		this.$importImage = $("#mnuImportImage");
		this.$importImage.click(function() { that.importImage(); });

		this.$addStickman = $("#mnuAddStickman");
		this.$addStickman.click(function() {console.log("pressed");that.controller.getProject().addFigure(new Stickman("toll"));that.controller.update(); });

		$('[data-submenu]')["submenupicker"]();

	}


	private export() {
		var project = this.controller.getProject();
		let data = project.serialize();
		var json = JSON.stringify(data);
		var blob = new Blob([json], { type: "text/json" });
		saveAs(blob, $.validator.format("{0}.json", project.getName()));
	}

	private import() {
		var that = this;
		var $ipt: JQuery = $("<input type=\"file\">");
		$ipt.on("change", function(evt) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var project = Project.deserialize(e.target["result"]);
				that.controller.update();
			};
			reader.readAsText(evt.target["files"][0]);
		});
		$ipt.trigger("click");
	}

	private importImage() {
		var that = this;
		var $ipt: JQuery = $("<input type=\"file\">");
		$ipt.on("change", function(evt) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var project: Project = that.controller.getProject();
				project.addImage(e.target["result"]);
				that.controller.update();
			};
			reader.readAsDataURL(evt.target["files"][0]);
		});
		$ipt.trigger("click");
	}

	private openProjectClick() {
		var that = this;
		return function() {
			var $btnOpenProject = $("#btnOpenProject");
			$btnOpenProject.addClass("disabled");
			$btnOpenProject.unbind();
			var p_name = null;
			var $tbody = $("#tblProjectLoad tbody");
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
					p_name = $(this).data("name");
					$btnOpenProject.removeClass("disabled");
				});
				$tbody.append($tr);
			}
			$btnOpenProject.click(function() {
				if (p_name != null) {
					$("#openFileModal")["modal"]("hide");
					var project = that.projectStorage.getProjectFromLocalStorage(p_name);
					that.controller.update();
				}
			});
		}
	}

	private saveProjectClick() {
		var that = this;
		return function() {
			var $tbody = $("#tblProjectSave tbody");
			var project = that.controller.getProject();
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
			$("#iptProjectSave").val(project.getName());
			$("#btnSaveProject").unbind();
			$("#btnSaveProject").click(function() {
				var name = $("#iptProjectSave").val();
				project["name"] = name;
				that.projectStorage.saveProjectToLocalStorage(project);
			});
		}
	}


}