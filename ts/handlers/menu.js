/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/FileSaver.d.ts" />
/// <reference path="../definitions/jszip.d.ts" />
/// <reference path="../definitions/jquery.validation.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../project/project.ts" />
/// <reference path="../project/storage.ts" />
var MenuHandler = (function () {
    function MenuHandler(project) {
        var that = this;
        this.projectStorage = new ProjectStorage();
        this.project = project;
        this.$open = $("#btnOpen");
        this.$open.click(this.openProjectClick());
        this.$save = $("#btnSave");
        this.$save.click(this.saveProjectClick());
        this.$export = $("#mnuExport");
        this.$export.click(function () { that.export(); });
        this.$import = $("#mnuImport");
        this.$import.click(function () { that.import(); });
        this.callbacks = [];
    }
    MenuHandler.prototype.addCallback = function (cb) {
        this.callbacks.push(cb);
    };
    MenuHandler.prototype.setProject = function (project) {
        this.project = project;
    };
    MenuHandler.prototype.export = function () {
        var data = this.project.serialize();
        var json = JSON.stringify(data);
        var blob = new Blob([json], { type: "text/json" });
        saveAs(blob, $.validator.format("{0}.json", this.project.getName()));
    };
    MenuHandler.prototype.import = function () {
        var that = this;
        var $ipt = $("<input type=\"file\">");
        $ipt.on("change", function (evt) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var project = Project.deserialize(e.target["result"]);
                for (var _i = 0, _a = that.callbacks; _i < _a.length; _i++) {
                    var callback = _a[_i];
                    callback(project);
                }
            };
            reader.readAsText(evt.target["files"][0]);
        });
        $ipt.trigger("click");
    };
    MenuHandler.prototype.openProjectClick = function () {
        var that = this;
        return function () {
            var $btnOpenProject = $("#btnOpenProject");
            $btnOpenProject.addClass("disabled");
            $btnOpenProject.unbind();
            var p_name = null;
            var $tbody = $("#tblProjectLoad tbody");
            $tbody.empty();
            var dic = that.projectStorage.getLocalStorageTOC();
            for (var name in dic) {
                var $tr = $("<tr>");
                $tr.append($.validator.format("<th>{0}</th><th>{1}</th>", name, dic[name]["date"]));
                $tr.data("name", name);
                $tr.click(function () {
                    $tbody.find("tr").removeClass("success");
                    $(this).addClass("success");
                    p_name = $(this).data("name");
                    $btnOpenProject.removeClass("disabled");
                });
                $tbody.append($tr);
            }
            $btnOpenProject.click(function () {
                if (p_name != null) {
                    $("#openFileModal")["modal"]("hide");
                    var project = that.projectStorage.getProjectFromLocalStorage(p_name);
                    for (var _i = 0, _a = that.callbacks; _i < _a.length; _i++) {
                        var callback = _a[_i];
                        callback(project);
                    }
                }
            });
        };
    };
    MenuHandler.prototype.saveProjectClick = function () {
        var that = this;
        return function () {
            var $tbody = $("#tblProjectSave tbody");
            $tbody.empty();
            var dic = that.projectStorage.getLocalStorageTOC();
            for (var name in dic) {
                var $tr = $("<tr>");
                $tr.append($.validator.format("<th>{0}</th><th>{1}</th>", name, dic[name]["date"]));
                $tr.data("name", name);
                $tr.click(function () {
                    $tbody.find("tr").removeClass("success");
                    $(this).addClass("success");
                    $("#iptProjectSave").val($(this).data("name"));
                });
                $tbody.append($tr);
            }
            $("#iptProjectSave").val(that.project.getName());
            $("#btnSaveProject").unbind();
            $("#btnSaveProject").click(function () {
                var name = $("#iptProjectSave").val();
                that.project["name"] = name;
                that.projectStorage.saveProjectToLocalStorage(that.project);
            });
        };
    };
    return MenuHandler;
}());
