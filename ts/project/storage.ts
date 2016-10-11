/// <reference path="./project.ts" />


class ProjectStorage {

	static TOC: string = "TableOfContent"

	public getLocalStorageTOC() {

		return JSON.parse(localStorage.getItem(ProjectStorage.TOC));

	}

	public getProjectFromLocalStorage(name: string): Object {
		return Project.deserialize(localStorage.getItem(name));
	}

	public getImageFromLocalStorage(name: string) {
		return localStorage.getItem(name);
	};

	public saveProjectToLocalStorage(project: Project) {
		var toc = JSON.parse(localStorage.getItem(ProjectStorage.TOC));
		toc = toc == null ? { images: {}, projects: {} } : toc;
		var name: string = project.getName();
		localStorage.setItem(name, JSON.stringify(project.serialize()));
		toc["projects"][name] = { "name": name, "date": new Date() }
		localStorage.setItem(ProjectStorage.TOC, JSON.stringify(toc));
	}

	public saveImageToLocalStorage(name: string, image: string) {
		var toc = JSON.parse(localStorage.getItem(ProjectStorage.TOC));
		toc = toc == null ? { images: {}, projects: {} } : toc;
		localStorage.setItem(name, image);
		toc["images"][name] = { "name": name, "date": new Date() }
		localStorage.setItem(ProjectStorage.TOC, JSON.stringify(toc));
	}

}