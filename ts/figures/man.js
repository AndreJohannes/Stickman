/// <reference path="./node.ts" />
/// <reference path="./ifigure.ts" />
/// <reference path="../visual/primitives/rectangle.ts" />
var Man = (function () {
    function Man(name) {
        //this.root = new Node_(localStorage.getItem("stickman"));
        //return
        this.name = name;
        var texture = TextureHandler.Man;
        var rectTorso = new Rect(6, 13, 33, 95, texture);
        rectTorso.setPivot(new THREE.Vector2(15, 82));
        rectTorso.setAnchor(new THREE.Vector2(17, 24));
        var rectLeg = new Rect(0, 100, 29, 168, texture);
        rectLeg.setPivot(new THREE.Vector2(15, 112));
        rectLeg.setAnchor(new THREE.Vector2(18.5, 159.5));
        var rectFoot = new Rect(9, 173, 29, 233, texture);
        rectFoot.setPivot(new THREE.Vector2(18.5, 183.5));
        rectFoot.setAnchor(new THREE.Vector2(17.5, 227.5));
        var rectArm = new Rect(32, 12, 51, 59, texture);
        rectArm.setPivot(new THREE.Vector2(42, 21));
        rectArm.setAnchor(new THREE.Vector2(42, 51.5));
        var rectHand = new Rect(34, 124, 50, 168, texture);
        rectHand.setPivot(new THREE.Vector2(42, 131.5));
        rectHand.setAnchor(new THREE.Vector2(42, 164));
        var rectKopf = new Rect(68, 33, 109, 88, texture);
        rectKopf.setPivot(new THREE.Vector2(89, 87));
        rectKopf.setAnchor(new THREE.Vector2(89, 40));
        var root = new Node_(new THREE.Vector2(0, 0));
        var torso = new Node_(rectTorso.getLength(), 0);
        var leg1 = new Node_(rectLeg.getLength(), Math.PI);
        var foot1 = new Node_(rectFoot.getLength(), 0);
        var leg2 = new Node_(rectLeg.getLength(), Math.PI);
        var foot2 = new Node_(rectFoot.getLength(), 0);
        var arm1 = new Node_(rectArm.getLength(), 0);
        var hand1 = new Node_(rectHand.getLength(), 0);
        var kopf = new Node_(rectKopf.getLength(), 0);
        root.addChild(torso);
        root.addChild(leg1);
        leg1.addChild(foot1);
        root.addChild(leg2);
        leg2.addChild(foot2);
        torso.addChild(arm1);
        arm1.addChild(hand1);
        torso.addChild(kopf);
        torso.addVisual(new Rectangle(rectTorso), new Rectangle(rectTorso));
        leg1.addVisual(new Rectangle(rectLeg), new Rectangle(rectLeg));
        foot1.addVisual(new Rectangle(rectFoot), new Rectangle(rectFoot));
        leg2.addVisual(new Rectangle(rectLeg), new Rectangle(rectLeg));
        foot2.addVisual(new Rectangle(rectFoot), new Rectangle(rectFoot));
        arm1.addVisual(new Rectangle(rectArm), new Rectangle(rectArm));
        hand1.addVisual(new Rectangle(rectHand), new Rectangle(rectHand));
        kopf.addVisual(new Rectangle(rectKopf), new Rectangle(rectKopf));
        this.root = root;
    }
    Man.prototype.getVisual = function () {
        return this.root.getVisual();
    };
    Man.prototype.getPhantom = function () {
        return this.root.getVisual(true);
    };
    Man.prototype.getRoot = function () {
        return this.root;
    };
    Man.prototype.getName = function () {
        return this.name;
    };
    Man.prototype.setName = function (name) {
        this.name = name;
    };
    Man.prototype.serialize = function () {
        var figure = new FigureWrapped();
        figure.name = this.name;
        figure.root = this.root.serialize();
        return figure;
    };
    return Man;
}());
