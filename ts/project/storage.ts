/// <reference path="./project.ts" />


class ProjectStorage {

	static TOC: string = "TableOfContent"

	public getLocalStorageTOC() {
		return JSON.parse(localStorage.getItem(ProjectStorage.TOC));
	}

	public getProjectFromLocalStorage(name: string): Project {
		return Project.deserialize(localStorage.getItem(name));
	}

	public getImageFromLocalStorage(name: string) {
		return localStorage.getItem(name);
	};

	public saveProjectToLocalStorage(project: Project) {
		var toc = JSON.parse(localStorage.getItem(ProjectStorage.TOC));
		toc = toc == null ? {} : toc;
		var name: string = project.getName();
		localStorage.setItem(name, JSON.stringify(project.serialize()));
		toc[name] = { "name": name, "date": new Date() }
		localStorage.setItem(ProjectStorage.TOC, JSON.stringify(toc));
	}

	public deleteProjectFromLocalStorage(name: string) {
		var toc = JSON.parse(localStorage.getItem(ProjectStorage.TOC));
		toc = toc == null ? {} : toc;
		delete toc[name];
		localStorage.removeItem(name);
		localStorage.setItem(ProjectStorage.TOC, JSON.stringify(toc));
	}

}