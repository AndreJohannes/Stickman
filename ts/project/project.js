/// <reference path="../figures/ifigure.ts" />
/// <reference path="../definitions/jquery.d.ts" />
var Project = (function () {
    function Project(name, size) {
        if (size === void 0) { size = [1280, 720]; }
        this.name = name;
        this.figures = [];
        this.images = {};
        this.size = size;
        this.frameCount = 30;
    }
    Project.prototype.setName = function (name) {
        this.name = name;
    };
    Project.prototype.getName = function () {
        return this.name;
    };
    Project.prototype.addFigure = function (figure) {
        this.figures.push(figure);
    };
    Project.prototype.getFigures = function () {
        return this.figures;
    };
    Project.prototype.addImage = function (uuid, image) {
        this.images[uuid] = image;
    };
    Project.prototype.getImages = function () {
        return this.images;
    };
    Project.prototype.getSize = function () {
        return this.size;
    };
    Project.prototype.findFigure = function (root) {
        if (!root.isRoot())
            throw new Error("Node is not a root");
        for (var _i = 0, _a = this.figures; _i < _a.length; _i++) {
            var figure = _a[_i];
            if (figure.getRoot() == root)
                return figure;
        }
        return null;
    };
    Project.prototype.removeFigure = function (figure) {
        var index = this.figures.indexOf(figure);
        if (index >= 0) {
            this.figures.splice(index, 1);
        }
    };
    Project.prototype.serialize = function () {
        var figures = [];
        for (var _i = 0, _a = this.figures; _i < _a.length; _i++) {
            var figure = _a[_i];
            figures.push(figure.serialize());
        }
        return { "name": this.name, "figures": figures, "images": this.images, "size": this.size };
    };
    Project.deserialize = function (input) {
        var json = JSON.parse(input);
        var projectName = json["name"];
        var figures = json["figures"];
        var images = json["images"];
        var size = json["size"];
        var project = new Project(projectName, size);
        project.images = images;
        $.each(figures, function (index, figure) { project.figures.push(IFigure.deserialize(figure)); });
        return project;
    };
    return Project;
}());
