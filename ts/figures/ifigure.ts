/// <reference path="./node.ts" />

interface IFigure{

	getVisual(): THREE.Object3D;

	getPhantom(): THREE.Object3D;

	getRoot(): Node_;

	getName(): string 

}