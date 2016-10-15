/// <reference path="../figures/ifigure.ts" />
/// <reference path="../definitions/jquery.d.ts" />

class Project {

	private name: string;
	private figures: IFigure[];
	private images: string[];

	constructor(name: string) {
		this.name = name;
		this.figures = [];
		this.images = [];
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

	public addImage(image: string){
		this.images.push(image);
	}

	public getImages(): string[]{
		return this.images;
	}

	public serialize(): Object {
		var figures = [];
		for (var figure of this.figures) {
			figures.push(figure.serialize());
		}
		return { "name": this.name, "figures": figures, "images": this.images };
	}

	static deserialize(input: string): Project {
		var json = JSON.parse(input);
		var projectName = json["name"];
		var figures = json["figures"];
		var images = json["images"];
		var project = new Project(projectName);
		project.images = images;
		$.each(figures, function(index, figure) { project.figures.push(GenericFigure.deserialize(figure)) });
		return project;
	}

}