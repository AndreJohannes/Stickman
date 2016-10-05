/// <reference path="./node.ts" />
/// <reference path="../visual/primitives/limb.ts" />
/// <reference path="../visual/primitives/head.ts" />
var Stickman = (function () {
    function Stickman() {
        var root = new Node_(new THREE.Vector2(0, 0));
        var torso = new Node_(60, 0);
        var leg_1 = new Node_(50, Math.PI * 3 / 4);
        var leg_2 = new Node_(50, -Math.PI * 3 / 4);
        var shin_1 = new Node_(50, Math.PI * 1 / 4);
        var shin_2 = new Node_(50, -Math.PI * 1 / 4);
        var arm_1 = new Node_(40, Math.PI * 3 / 4);
        var arm_2 = new Node_(40, -Math.PI * 3 / 4);
        var lower_arm_1 = new Node_(40, Math.PI * 1 / 4);
        var lower_arm_2 = new Node_(40, -Math.PI * 1 / 4);
        var head = new Node_(35, 0);
        root.addChild(torso);
        root.addChild(leg_1);
        root.addChild(leg_2);
        torso.addChild(arm_1);
        torso.addChild(arm_2);
        torso.addChild(head);
        leg_1.addChild(shin_1);
        leg_2.addChild(shin_2);
        arm_1.addChild(lower_arm_1);
        arm_2.addChild(lower_arm_2);
        torso.addVisual(new Limb(60), new Limb(60, true));
        leg_1.addVisual(new Limb(50), new Limb(50, true));
        leg_2.addVisual(new Limb(50), new Limb(50, true));
        shin_1.addVisual(new Limb(50), new Limb(50, true));
        shin_2.addVisual(new Limb(50), new Limb(50, true));
        arm_1.addVisual(new Limb(40), new Limb(40, true));
        arm_2.addVisual(new Limb(40), new Limb(40, true));
        lower_arm_1.addVisual(new Limb(40), new Limb(40, true));
        lower_arm_2.addVisual(new Limb(40), new Limb(40, true));
        head.addVisual(new Head(35), new Head(35, true));
        this.root = root;
    }
    Stickman.prototype.getObject = function () {
        return this.root.getVisual();
    };
    Stickman.prototype.getPhantom = function () {
        return this.root.getVisual(true);
    };
    Stickman.prototype.getRoot = function () {
        return this.root;
    };
    return Stickman;
}());
