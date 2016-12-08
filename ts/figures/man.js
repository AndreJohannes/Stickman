/// <reference path="./node.ts" />
/// <reference path="./ifigure.ts" />
/// <reference path="../visual/primitives/rectangle.ts" />
/// <reference path="../visual/textures.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Man = (function (_super) {
    __extends(Man, _super);
    function Man(name) {
        _super.call(this);
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
        torso.addVisual(new Rectangle(rectTorso), new Rectangle(rectTorso, true));
        leg1.addVisual(new Rectangle(rectLeg), new Rectangle(rectLeg, true));
        foot1.addVisual(new Rectangle(rectFoot), new Rectangle(rectFoot, true));
        leg2.addVisual(new Rectangle(rectLeg), new Rectangle(rectLeg, true));
        foot2.addVisual(new Rectangle(rectFoot), new Rectangle(rectFoot, true));
        arm1.addVisual(new Rectangle(rectArm), new Rectangle(rectArm, true));
        hand1.addVisual(new Rectangle(rectHand), new Rectangle(rectHand, true));
        kopf.addVisual(new Rectangle(rectKopf), new Rectangle(rectKopf, true));
        this.root = root;
    }
    return Man;
}(IFigure));
