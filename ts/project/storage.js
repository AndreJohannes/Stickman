/// <reference path="./project.ts" />
var ProjectStorage = (function () {
    function ProjectStorage() {
    }
    ProjectStorage.prototype.getLocalStorageTOC = function () {
        return JSON.parse(localStorage.getItem(ProjectStorage.TOC));
    };
    ProjectStorage.prototype.getProjectFromLocalStorage = function (name) {
        return Project.deserialize(localStorage.getItem(name));
    };
    ProjectStorage.prototype.getImageFromLocalStorage = function (name) {
        return localStorage.getItem(name);
    };
    ;
    ProjectStorage.prototype.saveProjectToLocalStorage = function (project) {
        var toc = JSON.parse(localStorage.getItem(ProjectStorage.TOC));
        toc = toc == null ? { images: {}, projects: {} } : toc;
        var name = project.getName();
        localStorage.setItem(name, JSON.stringify(project.serialize()));
        toc["projects"][name] = { "name": name, "date": new Date() };
        localStorage.setItem(ProjectStorage.TOC, JSON.stringify(toc));
    };
    ProjectStorage.prototype.saveImageToLocalStorage = function (name, image) {
        var toc = JSON.parse(localStorage.getItem(ProjectStorage.TOC));
        toc = toc == null ? { images: {}, projects: {} } : toc;
        localStorage.setItem(name, image);
        toc["images"][name] = { "name": name, "date": new Date() };
        localStorage.setItem(ProjectStorage.TOC, JSON.stringify(toc));
    };
    ProjectStorage.TOC = "TableOfContent";
    return ProjectStorage;
}());
