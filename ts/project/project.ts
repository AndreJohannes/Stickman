/// <reference path="../figures/ifigure.ts" />
/// <reference path="../definitions/jquery.d.ts" />

class Project {

	private name: string;
	private figures: IFigure[];

	constructor(name: string) {
		this.name = name;
		this.figures = [];
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

	public serialize(): Object {
		var figures = [];
		for (var figure of this.figures) {
			figures.push(figure.serialize());
		}
		return { "name": this.name, "figures": figures };
	}

	static deserialize(input: string): Project {
		var json = JSON.parse(input);
		var projectName = json["name"];
		var figures = json["figures"];
		var project = new Project(projectName);
		$.each(figures, function(index, figure) { project.figures.push(GenericFigure.deserialize(figure)) });
		return project;
	}

}