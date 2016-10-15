/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/FileSaver.d.ts" />
/// <reference path="../definitions/jszip.d.ts" />
/// <reference path="../definitions/jquery.validation.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../project/project.ts" />
/// <reference path="../project/storage.ts" />
/// <reference path="../sticky.ts" />
var MenuHandler = (function () {
    function MenuHandler(controller) {
        var that = this;
        this.projectStorage = new ProjectStorage();
        this.controller = controller;
        this.$open = $("#btnOpen");
        this.$open.click(this.openProjectClick());
        this.$save = $("#btnSave");
        this.$save.click(this.saveProjectClick());
        this.$export = $("#mnuExport");
        this.$export.click(function () { that.export(); });
        this.$import = $("#mnuImport");
        this.$import.click(function () { that.import(); });
        this.$importImage = $("#mnuImportImage");
        this.$importImage.click(function () { that.importImage(); });
        this.callbacks = [];
    }
    MenuHandler.prototype.addCallback = function (cb) {
        this.callbacks.push(cb);
    };
    MenuHandler.prototype.export = function () {
        var project = this.controller.getProject();
        var data = project.serialize();
        var json = JSON.stringify(data);
        var blob = new Blob([json], { type: "text/json" });
        saveAs(blob, $.validator.format("{0}.json", project.getName()));
    };
    MenuHandler.prototype.import = function () {
        var that = this;
        var $ipt = $("<input type=\"file\">");
        $ipt.on("change", function (evt) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var project = Project.deserialize(e.target["result"]);
                that.controller.update();
                for (var _i = 0, _a = that.callbacks; _i < _a.length; _i++) {
                    var callback = _a[_i];
                    callback(project);
                }
            };
            reader.readAsText(evt.target["files"][0]);
        });
        $ipt.trigger("click");
    };
    MenuHandler.prototype.importImage = function () {
        var that = this;
        var $ipt = $("<input type=\"file\">");
        $ipt.on("change", function (evt) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var project = that.controller.getProject();
                project.addImage(e.target["result"]);
                that.controller.update();
            };
            reader.readAsDataURL(evt.target["files"][0]);
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
                    that.controller.update();
                }
            });
        };
    };
    MenuHandler.prototype.saveProjectClick = function () {
        var that = this;
        return function () {
            var $tbody = $("#tblProjectSave tbody");
            var project = that.controller.getProject();
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
            $("#iptProjectSave").val(project.getName());
            $("#btnSaveProject").unbind();
            $("#btnSaveProject").click(function () {
                var name = $("#iptProjectSave").val();
                project["name"] = name;
                that.projectStorage.saveProjectToLocalStorage(project);
            });
        };
    };
    return MenuHandler;
}());
