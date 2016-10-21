/// <reference path="../figures/ifigure.ts" />
/// <reference path="../definitions/jquery.d.ts" />

class Project {

	private name: string;
	private figures: IFigure[];
	private images: Object;
	private size: number[];

	constructor(name: string, size = [1280, 720]) {
		this.name = name;
		this.figures = [];
		this.images = {};
		this.size = size;
	}

	public setName(name: string) {
		this.name = name;
	}

	public getName(): string {
		return this.name;
	}

	public addFigure(figure: IFigure) {
		this.figures.push(figure);
	}

	public getFigures(): IFigure[] {
		return this.figures;
	}

	public addImage(uuid: string, image: string) {
		this.images[uuid] = image;
	}

	public getImages(): Object {
		return this.images;
	}

	public getSize(): number[] {
		return this.size;
	}

	public serialize(): Object {
		var figures = [];
		for (var figure of this.figures) {
			figures.push(figure.serialize());
		}
		return { "name": this.name, "figures": figures, "images": this.images, "size": this.size };
	}

	static deserialize(input: string): Project {
		var json = JSON.parse(input);
		var projectName = json["name"];
		var figures = json["figures"];
		var images = json["images"];
		var size = json["size"];
		var project = new Project(projectName, size);
		project.images = images;
		$.each(figures, function(index, figure) { project.figures.push(GenericFigure.deserialize(figure)) });
		return project;
	}

}