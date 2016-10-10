/// <reference path="./project.ts" />


class ProjectStorage {

	static TOC: string = "TableOfContent"

	public getLocalStorageTOC() {

		return JSON.parse(localStorage.getItem(ProjectStorage.TOC));

	}

	public getProjectFromLocalStorage(name: string): Object {
		return Project.deserialize(localStorage.getItem(name));
	}

	public saveProjectToLocalStorage(project: Project) {
		var toc = JSON.parse(localStorage.getItem(ProjectStorage.TOC));
		toc = toc == null ? {} : toc;
		var name: string = project.getName();
		console.log(project.serialize());
		localStorage.setItem(name, JSON.stringify(project.serialize()));
		toc[name] = { "name": name, "date": new Date() }
		localStorage.setItem(ProjectStorage.TOC, JSON.stringify(toc));
	}

}