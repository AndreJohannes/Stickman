/// <reference path="renderer.ts" />
/// <reference path="./figures/node.ts" />
var Player = (function () {
    function Player(renderer) {
        this.renderer = renderer;
    }
    Player.prototype.play = function (nodes, callback) {
        this.setMode(nodes, NodeMode.Play);
        this._play(1, 100, nodes, callback)();
    };
    Player.prototype._play = function (frame, stopFrame, nodes, callback) {
        var that = this;
        return function () {
            if (frame > stopFrame) {
                that.setMode(nodes, NodeMode.Edit);
                callback();
                return;
            }
            setTimeout(that._play(frame + 1, stopFrame, nodes, callback), 33);
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                node.draw(Math.round(frame / 1));
            }
            that.renderer.update();
        };
    };
    Player.prototype.setMode = function (nodes, mode) {
        for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
            var node = nodes_2[_i];
            node.setMode(mode);
        }
    };
    return Player;
}());
/// <reference path="../definitions/jquery.d.ts" />
var TimelineHandler = (function () {
    function TimelineHandler(figures) {
        this.callbacks = [];
        this.figures = figures;
        this.$timeline = $("#timeline");
        this.$trFirst = this.$timeline.find("tr").first();
        this.$table = $("table");
        var trList = [];
        for (i = 0; i < 5; i++) {
            var $tr = $("<tr></tr>");
            trList.push($tr);
            this.$table.append($tr);
        }
        for (var i = 1; i < 50; i++) {
            var $th = $("<th>" + i + "</th>");
            $th.data("index", i);
            $th.click(this.getClick());
            this.$trFirst.append($th);
            for (var _i = 0, trList_1 = trList; _i < trList_1.length; _i++) {
                var $tr_1 = trList_1[_i];
                var $td = $("<td><div class=\"brick\"></div></td>");
                $tr_1.append($td);
            }
        }
        for (var i = 1; i < 50; i++) {
            this.updateFrame(i);
        }
    }
    TimelineHandler.prototype.setFrame = function (frame) {
        $("th").css("background-color", "");
        //this.frame = frame;
        $($("th").get(frame - 1)).css("background-color", "red");
    };
    TimelineHandler.prototype.addCallback = function (cb) {
        this.callbacks.push(cb);
    };
    TimelineHandler.prototype.getClick = function () {
        var that = this;
        return function () {
            var frame = $(this).data("index");
            $("th").css("background-color", "");
            $(this).css("background-color", "red");
            for (var _i = 0, _a = that.callbacks; _i < _a.length; _i++) {
                var callback = _a[_i];
                callback(frame);
            }
        };
    };
    TimelineHandler.prototype.updateFrame = function (frame) {
        $.each(this.figures, function (index, value) {
            var div = $("tr").eq(index + 1).find("td").eq(frame - 1).find("div");
            if (value["position"].has(frame)) {
                div.removeClass("brick-nd");
            }
            else {
                div.addClass("brick-nd");
            }
        });
    };
    return TimelineHandler;
}());
/// <reference path="renderer.ts" />
/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/jszip.d.ts" />
/// <reference path="./definitions/FileSaver.d.ts" />
/// <reference path="./figures/node.ts" />
var Download = (function () {
    function Download(renderer) {
        this.renderer = renderer;
    }
    Download.prototype.zipAndSave = function (nodes) {
        var zip = new JSZip();
        $.each(nodes, function (index, node) { node.setMode(NodeMode.Play); });
        for (var i = 1; i < 50; i++) {
            $.each(nodes, function (index, node) { node.draw(i); });
            this.renderer.update();
            var img = $("canvas").get(0)["toDataURL"]();
            zip.file("frame" + i + ".png", img.replace("data:image/png;base64,", ""), { base64: true });
            console.log("make frame: " + i);
        }
        zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "test.zip");
        });
    };
    return Download;
}());
/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/splitpane.d.ts" />
/// <reference path="renderer.ts" />
/// <reference path="figures/stickman.ts" />
/// <reference path="figures/background.ts" />
/// <reference path="player.ts" />
/// <reference path="download.ts" />
/// <reference path="handlers/timeline.ts" />
var mouseEventHandler = function ($element, callback, activator, deactivator) {
    var selectedNode = null;
    $element.mousedown(function (e) { activator(e.offsetX - 1280 / 2, e.offsetY - 720 / 2); });
    $element.mouseleave(function () { deactivator(); });
    $element.mouseup(function () { deactivator(); });
    $element.mousemove(function (e) {
        callback(e.offsetX - 1280 / 2, e.offsetY - 720 / 2);
    });
};
var FrameHandler = function () {
    var frameNumber = 1;
    var callbacks = [];
    var $btnUp = $("#btnFrameUp");
    var $btnDown = $("#btnFrameDown");
    var $iptFrame = $("#iptFrame");
    var setFrameNumber = function (frame) {
        frameNumber = frame > 0 ? frame : frameNumber;
        $iptFrame.val(frameNumber);
        for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
            var callback = callbacks_1[_i];
            callback(frameNumber);
        }
    };
    $btnUp.click(function () { setFrameNumber(frameNumber + 1); });
    $btnDown.click(function () { setFrameNumber(frameNumber - 1); });
    $iptFrame.change(function () {
        var val = $iptFrame.val();
        if ($.isNumeric(val)) {
            setFrameNumber(Math.round(val));
        }
    });
    this.addCallback = function (cb) {
        callbacks.push(cb);
    };
    this.getFrame = function () {
        return frameNumber;
    };
    this.setFrame = function (frame) {
        setFrameNumber(frame);
    };
};
var canvasResizer = function (renderer) {
    var $div = $("#right-component");
    var hasResized = false;
    var aspectRation = 1280 / 720;
    $(".split-pane").on('splitpaneresize', function () { hasResized = true; });
    $(window).mouseup(function () {
        if (hasResized && false) {
            hasResized = false;
            var height = $div.height() - 1;
            var width = $div.width() - 1;
            if (width / height > aspectRation) {
                renderer.resize(aspectRation * height, height);
            }
            else {
                renderer.resize(width, width / aspectRation);
            }
        }
    });
};
var canvasResizer2 = function () {
    var $horizontalSplit = $("div.split-pane").eq(0);
    var $verticalSplit = $("div.split-pane").eq(1);
    this.expand = function () {
        $verticalSplit.splitPane("lastComponentSize", 1300);
        $horizontalSplit.splitPane("firstComponentSize", 721);
        $verticalSplit.splitPane("lastComponentSize", 1280);
    };
};
$(document).ready(function () {
    var stickman1 = new Stickman();
    var stickman2 = new Stickman();
    var background = new Background();
    var roots = [stickman1.getRoot(), stickman2.getRoot()];
    var $frame = $("#frame");
    var $timeline = $("#timeline");
    var $play = $("#btnPlay");
    var $resize = $("#btnResize");
    var $download = $("#btnDownload");
    var resizer = new canvasResizer2();
    var renderer = new GLRenderer();
    var player = new Player(renderer);
    var download = new Download(renderer);
    var frameHandler = new FrameHandler();
    var timelineHandler = new TimelineHandler(roots);
    renderer.addObject(stickman1.getObject());
    renderer.addObject(stickman1.getPhantom());
    renderer.addObject(stickman2.getObject());
    renderer.addObject(stickman2.getPhantom());
    //renderer.addObject(background.getObject());
    var $canvas = $(renderer.getDom());
    $play.click(function () { player.play(roots, function () { $.each(roots, function (index, root) { root.draw(frameHandler.getFrame()); }); }); });
    $resize.click(function () { resizer.expand(); });
    $download.click(function () { download.zipAndSave(roots); $.each(roots, function (index, root) { root.draw(frameHandler.getFrame()); }); });
    window["roots"] = roots;
    window["timeline"] = timelineHandler;
    frameHandler.addCallback(timelineHandler.setFrame);
    frameHandler.addCallback(function (frame) { for (var _i = 0, roots_1 = roots; _i < roots_1.length; _i++) {
        var root = roots_1[_i];
        root.draw(frame);
    } renderer.update(); });
    timelineHandler.addCallback(frameHandler.setFrame);
    timelineHandler.addCallback(function (frame) { for (var _i = 0, roots_2 = roots; _i < roots_2.length; _i++) {
        var root = roots_2[_i];
        root.draw(frame);
    } renderer.update(); });
    var activeNode = null;
    mouseEventHandler($canvas, function (x, y) {
        if (activeNode != null) {
            var frame = frameHandler.getFrame();
            var xOffset = activeNode.pivot.x;
            var yOffset = activeNode.pivot.y;
            if (activeNode.node.isRoot()) {
                activeNode.node.setPosition(x, y, frame);
            }
            else {
                activeNode.node.setAlpha(Math.atan2(-x + xOffset, -y + yOffset) - activeNode.alpha, frame);
            }
            activeNode.node.draw(frame);
            renderer.update();
            timelineHandler.updateFrame(frame);
        }
    }, function (x, y) {
        var frame = frameHandler.getFrame();
        for (var _i = 0, roots_3 = roots; _i < roots_3.length; _i++) {
            var root = roots_3[_i];
            var node = root.getProximityNodes(frame, 1000, new THREE.Vector2(x, y));
            activeNode = activeNode == null ? node : (activeNode.distance > node.distance ? node : activeNode);
        }
        if (activeNode != null) {
            activeNode.node.activate();
            activeNode.node.getRoot().manifest(frame);
            renderer.update();
        }
    }, function () {
        if (activeNode != null) {
            activeNode.node.deactivate();
            activeNode = null;
            renderer.update();
        }
    });
    $frame.append($canvas);
    $('div.split-pane').splitPane();
    roots[0].draw(1);
    renderer.update();
    //canvasResizer(renderer);
});
/// <reference path="../definitions/three.d.ts" />
/// <reference path="../visual/dots.ts" />
/// <reference path="./primitives/factory.ts" />
/// <reference path="../figures/node.ts" />
var Visual = (function () {
    function Visual() {
        this.isVisual = true;
        this.mode = NodeMode.Edit;
        this.primary = new THREE.Object3D();
        this.secondary = new THREE.Object3D();
        this.dot = new Dot(Color.Blue).getObject();
        this.dot_active = new Dot(Color.Red).getObject();
        this.primary.add(this.dot);
        this.primary.add(this.dot_active);
    }
    Visual.prototype.setMode = function (mode) {
        switch (mode) {
            case NodeMode.Play:
                this.secondary.visible = false;
                this.primary.visible = true;
                this.dot.visible = false;
                this.dot_active.visible = false;
                break;
            case NodeMode.Edit:
                this.secondary.visible = true;
                this.primary.visible = true;
                this.dot.visible = true;
                this.dot_active.visible = false;
                break;
        }
    };
    Visual.prototype.activate = function () {
        this.dot_active.visible = true;
    };
    Visual.prototype.deactivate = function () {
        this.dot_active.visible = false;
    };
    Visual.prototype.setDotPosition = function (x, y) {
        this.dot.position.set(x, y, 0);
        this.dot_active.position.set(x, y, 0);
    };
    Visual.prototype.rotate = function (x, secondary) {
        if (secondary)
            this.secondary.rotation.set(0, 0, x);
        else
            this.primary.rotation.set(0, 0, x);
    };
    Visual.prototype.position = function (x, y, secondary) {
        if (secondary)
            this.secondary.position.set(x, y, 0);
        else
            this.primary.position.set(x, y, 0);
    };
    Visual.prototype.getPrimary = function () {
        return this.primary;
    };
    Visual.prototype.getSecondary = function () {
        return this.secondary;
    };
    Visual.prototype.showSecondary = function (show) {
        this.secondary.visible = show;
    };
    Visual.prototype.add = function (visual) {
        this.primary.add(visual.primary);
        this.secondary.add(visual.secondary);
    };
    Visual.prototype.addPrimary = function (object) {
        this.primary.add(object.getObject());
        this.primaryPrimitive = object;
    };
    Visual.prototype.addSecondary = function (object) {
        this.secondary.add(object.getObject());
        this.secondaryPrimitive = object;
    };
    Visual.prototype.serialize = function () {
        return {
            "primary": this.primaryPrimitive != null ? this.primaryPrimitive.serialize() : null,
            "secondary": this.secondaryPrimitive != null ? this.secondaryPrimitive.serialize() : null
        };
    };
    Visual.deserialize = function (object) {
        var retObject = new Visual();
        if (object["primary"] != null)
            retObject.addPrimary(Primitives.getPrimitive(object["primary"]["name"], object["primary"]));
        if (object["secondary"] != null)
            retObject.addSecondary(Primitives.getPrimitive(object["secondary"]["name"], object["secondary"]));
        return retObject;
    };
    return Visual;
}());
/// <reference path="../definitions/three.d.ts" />
var TextureHandler;
(function (TextureHandler) {
    (function (Texture) {
        Texture[Texture["Stickman1"] = 0] = "Stickman1";
        Texture[Texture["Background"] = 1] = "Background";
    })(TextureHandler.Texture || (TextureHandler.Texture = {}));
    var Texture = TextureHandler.Texture;
    var texture = function () {
        var retValue = {};
        retValue[Texture.Stickman1] = (new THREE.TextureLoader()).load("images/stickman1.png");
        retValue[Texture.Background] = (new THREE.TextureLoader()).load("images/cola.png");
        return retValue;
    }();
    function getTexture(tex) {
        return texture[tex];
    }
    TextureHandler.getTexture = getTexture;
})(TextureHandler || (TextureHandler = {}));
/// <reference path="../definitions/three.d.ts" />
/// <reference path="./textures.ts" />
var Color;
(function (Color) {
    Color[Color["Blue"] = 0] = "Blue";
    Color[Color["Red"] = 1] = "Red";
})(Color || (Color = {}));
var Dot = (function () {
    function Dot(color) {
        this.width = 8;
        this.color = color;
        var texture = TextureHandler.getTexture(TextureHandler.Texture.Stickman1);
        texture.minFilter = THREE.LinearFilter;
        //texture.magFilter= THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true
        });
        var mesh = new THREE.Mesh(this.makeGeometry(color), material);
        //mesh.position.set(-this.width / 2, 0, 0);
        mesh.renderOrder = color == Color.Blue ? 100 : 101;
        this.object = mesh;
    }
    Dot.prototype.getObject = function () {
        return this.object;
    };
    Dot.prototype.makeGeometry = function (color) {
        var geometry = new THREE.Geometry();
        var wd = this.width;
        geometry.vertices.push(new THREE.Vector3(-wd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(-wd / 2, wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, wd / 2, 0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(3, 2, 1));
        if (color == Color.Blue) {
            var vertexUvs0 = new THREE.Vector2(52 / 512, 1 - 1 / 512);
            var vertexUvs1 = new THREE.Vector2(102 / 512, 1 - 1 / 512);
            var vertexUvs2 = new THREE.Vector2(52 / 512, 1 - 52 / 512);
            var vertexUvs3 = new THREE.Vector2(102 / 512, 1 - 52 / 512);
            geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
            geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        }
        else {
            var vertexUvs0 = new THREE.Vector2(103 / 512, 1 - 1 / 512);
            var vertexUvs1 = new THREE.Vector2(152 / 512, 1 - 1 / 512);
            var vertexUvs2 = new THREE.Vector2(103 / 512, 1 - 52 / 512);
            var vertexUvs3 = new THREE.Vector2(153 / 512, 1 - 52 / 512);
            geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
            geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        }
        return geometry;
    };
    return Dot;
}());
/// <reference path="../../definitions/three.d.ts" />
/// <reference path="../textures.ts" />
/// <reference path="./factory.ts" />
var Head = (function () {
    function Head(size, phantom) {
        this.object = new THREE.Object3D();
        this.phantom = phantom != null ? phantom : false;
        this.size = size;
        var texture = TextureHandler.getTexture(TextureHandler.Texture.Stickman1);
        texture.minFilter = THREE.LinearFilter;
        //texture.magFilter= THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true
        });
        var mesh = new THREE.Mesh(this.makeGeometry(this.phantom), material);
        if (this.phantom)
            mesh.renderOrder = this.phantom ? -1 : 0;
        mesh.position.set(0, this.size / 2, 0);
        this.object.add(mesh);
    }
    Head.prototype.getObject = function () {
        return this.object;
    };
    Head.prototype.serialize = function () {
        return this._serialize();
    };
    Head.prototype.makeGeometry = function (phantom) {
        var geometry = new THREE.Geometry();
        var wd = this.size;
        geometry.vertices.push(new THREE.Vector3(-wd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(-wd / 2, wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd / 2, wd / 2, 0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(3, 2, 1));
        var xOffset = phantom ? 157 : 1;
        var vertexUvs0 = new THREE.Vector2((0 + xOffset) / 512, 1 - 1 / 512);
        var vertexUvs1 = new THREE.Vector2((50 + xOffset) / 512, 1 - 1 / 512);
        var vertexUvs2 = new THREE.Vector2((0 + xOffset) / 512, 1 - 52 / 512);
        var vertexUvs3 = new THREE.Vector2((50 + xOffset) / 512, 1 - 52 / 512);
        geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
        geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        return geometry;
    };
    Head.prototype._serialize = function () {
        return { "name": "head", "size": this.size, "phantom": this.phantom };
    };
    return Head;
}());
/// <reference path="./limb.ts" />
/// <reference path="./head.ts" />
/// <reference path="./rectangle.ts" />
var Primitives;
(function (Primitives) {
    var getArgs = function (args, name, dflt) {
        if (args[name.toLowerCase()] != null)
            return args[name.toLowerCase()];
        return dflt;
    };
    function getPrimitive(type, args) {
        switch (type.toLowerCase()) {
            case "limb":
                var length = getArgs(args, "length", 50);
                var phantom = getArgs(args, "phantom", false);
                return new Limb(length, phantom);
            case "head":
                var size = getArgs(args, "size", 50);
                var phantom = getArgs(args, "phantom", false);
                return new Head(size, phantom);
            case "rectangle":
                return new Rectangle();
            default:
                // code...
                break;
        }
    }
    Primitives.getPrimitive = getPrimitive;
})(Primitives || (Primitives = {}));
/// <reference path="../../definitions/three.d.ts" />
/// <reference path="../textures.ts" />
/// <reference path="./factory.ts" />
var Rectangle = (function () {
    function Rectangle() {
        this.object = new THREE.Object3D();
        var texture = TextureHandler.getTexture(TextureHandler.Texture.Background);
        this.height = 500;
        this.width = 500;
        texture.minFilter = THREE.LinearFilter;
        //texture.magFilter= THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true,
            opacity: 0.5
        });
        var mesh = new THREE.Mesh(this.makeGeometry(), material);
        mesh.position.set(0, 0, 0);
        this.object.add(mesh);
    }
    Rectangle.prototype.getObject = function () {
        return this.object;
    };
    Rectangle.prototype.serialize = function () {
        return this._serialize();
    };
    Rectangle.prototype.makeGeometry = function () {
        var geometry = new THREE.Geometry();
        var wd = this.width;
        var hd = this.height;
        geometry.vertices.push(new THREE.Vector3(-hd / 2, wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(-hd / 2, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(hd / 2, wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(hd / 2, -wd / 2, 0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(3, 2, 1));
        var vertexUvs0 = new THREE.Vector2(0, 1);
        var vertexUvs1 = new THREE.Vector2(1, 1);
        var vertexUvs2 = new THREE.Vector2(0, 0);
        var vertexUvs3 = new THREE.Vector2(1, 0);
        geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
        geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        return geometry;
    };
    Rectangle.prototype._serialize = function () {
        return { "name": "rectangle", "phantom": false };
    };
    return Rectangle;
}());
/// <reference path="../../definitions/three.d.ts" />
/// <reference path="./factory.ts" />
/// <reference path="../textures.ts" />
var Limb = (function () {
    function Limb(length, phantom) {
        this.object = new THREE.Object3D();
        this.width = 9;
        this.phantom = phantom != null ? phantom : false;
        this.length = length;
        var texture = TextureHandler.getTexture(TextureHandler.Texture.Stickman1);
        texture.minFilter = THREE.LinearFilter;
        //texture.magFilter= THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true
        });
        var mesh = new THREE.Mesh(this.makeGeometry(this.phantom), material);
        mesh.position.set(-this.width / 2, 0, 0);
        mesh.renderOrder = this.phantom ? -1 : 0;
        this.object.add(mesh);
    }
    Limb.prototype.getObject = function () {
        return this.object;
    };
    Limb.prototype.serialize = function () {
        return this._serialize();
    };
    Limb.prototype.makeGeometry = function (phantom) {
        var geometry = new THREE.Geometry();
        var wd = this.width;
        var lg = this.length;
        geometry.vertices.push(new THREE.Vector3(0, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd, -wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(wd, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, lg, 0));
        geometry.vertices.push(new THREE.Vector3(wd, lg, 0));
        geometry.vertices.push(new THREE.Vector3(0, lg + wd / 2, 0));
        geometry.vertices.push(new THREE.Vector3(wd, lg + wd / 2, 0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(3, 2, 1));
        geometry.faces.push(new THREE.Face3(2, 3, 4));
        geometry.faces.push(new THREE.Face3(5, 4, 3));
        geometry.faces.push(new THREE.Face3(4, 5, 6));
        geometry.faces.push(new THREE.Face3(7, 6, 5));
        var xOffset = phantom ? 10 : 0;
        var vertexUvs0 = new THREE.Vector2((0 + xOffset) / 512, 1 - 55.5 / 512);
        var vertexUvs1 = new THREE.Vector2((9 + xOffset) / 512, 1 - 55.5 / 512);
        var vertexUvs2 = new THREE.Vector2((0 + xOffset) / 512, 1 - 60 / 512);
        var vertexUvs3 = new THREE.Vector2((9 + xOffset) / 512, 1 - 60 / 512);
        var vertexUvs4 = new THREE.Vector2((0 + xOffset) / 512, 1 - 100 / 512);
        var vertexUvs5 = new THREE.Vector2((9 + xOffset) / 512, 1 - 100 / 512);
        var vertexUvs6 = new THREE.Vector2((0 + xOffset) / 512, 1 - 104.5 / 512);
        var vertexUvs7 = new THREE.Vector2((9 + xOffset) / 512, 1 - 104.5 / 512);
        geometry.faceVertexUvs[0].push([vertexUvs0, vertexUvs1, vertexUvs2]);
        geometry.faceVertexUvs[0].push([vertexUvs3, vertexUvs2, vertexUvs1]);
        geometry.faceVertexUvs[0].push([vertexUvs2, vertexUvs3, vertexUvs4]);
        geometry.faceVertexUvs[0].push([vertexUvs5, vertexUvs4, vertexUvs3]);
        geometry.faceVertexUvs[0].push([vertexUvs4, vertexUvs5, vertexUvs6]);
        geometry.faceVertexUvs[0].push([vertexUvs7, vertexUvs6, vertexUvs5]);
        return geometry;
    };
    Limb.prototype._serialize = function () {
        return { "name": "limb", "length": this.length, "phantom": this.phantom };
    };
    return Limb;
}());
/// <reference path="./definitions/three.d.ts" />
/// <reference path="./visual/primitives/limb.ts" />
var GLRenderer = (function () {
    function GLRenderer() {
        this.resolution = [1280, 720];
        var that = this;
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-this.resolution[0] / 2, this.resolution[0] / 2, this.resolution[1] / 2, -this.resolution[1] / 2);
        this.camera.position.z = 1024 / 2;
        var geometry = new THREE.PlaneGeometry(1280, 720); //THREE.BoxGeometry( 200, 1024, 200 );
        var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        //var object1 = (new Limb()).getObject();	
        //var object2 = (new Limb()).getObject();
        //object2.position.set(0,50,0);
        //object2.rotation.set(0,0,.2);
        //object1.rotation.set(0,0,.55);
        //object1.add(object2);
        //this.scene.add(object1);
        this.renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, alpha: false, antialias: false });
        //this.renderer.setClearColor(0xffffff, 0)
        this.renderer.setSize(this.resolution[0], this.resolution[1]);
        GLRenderer.heartbeat(this)();
    }
    GLRenderer.prototype.addObject = function (object) {
        this.scene.add(object);
    };
    GLRenderer.prototype.getDom = function () {
        return this.renderer.domElement;
    };
    GLRenderer.prototype.resize = function (x, y) {
        this.renderer.setSize(x, y);
    };
    GLRenderer.prototype.animate = function () {
        GLRenderer._animate(this)();
    };
    GLRenderer.prototype.update = function () {
        if (this.renderer != null) {
            this.renderer.render(this.scene, this.camera);
        }
    };
    GLRenderer._animate = function (render) {
        return function () {
            requestAnimationFrame(GLRenderer._animate(render));
            render.render();
        };
    };
    GLRenderer.heartbeat = function (renderer) {
        return function () {
            setTimeout(GLRenderer.heartbeat(renderer), 2000);
            if (renderer.renderer != null) {
                renderer.renderer.render(renderer.scene, renderer.camera);
            }
        };
    };
    GLRenderer.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    GLRenderer.webgl_support = function () {
        var retValue = false;
        try {
            var canvas = document.createElement("canvas");
            retValue = !!window["WebGLRenderingContext"] != null &&
                (canvas.getContext("webgl") != null ||
                    canvas.getContext("experimental-webgl")) != null;
        }
        catch (e) {
            return false;
        }
        return retValue;
    };
    return GLRenderer;
}());
/// <reference path="./node.ts" />
/// <reference path="../visual/primitives/rectangle.ts" />
var Background = (function () {
    function Background() {
        var root = new Node_(new THREE.Vector2(0, 0));
        var handle = new Node_(60, 0);
        root.addChild(handle);
        handle.addVisual(new Rectangle(), new Rectangle());
        this.root = root;
    }
    Background.prototype.getObject = function () {
        return this.root.getVisual();
    };
    Background.prototype.getRoot = function () {
        return this.root;
    };
    return Background;
}());
/// <reference path="./node.ts" />
/// <reference path="../visual/primitives/limb.ts" />
/// <reference path="../visual/primitives/head.ts" />
var Stickman = (function () {
    function Stickman() {
        //this.root = new Node_(localStorage.getItem("stickman"));
        //return
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
/// <reference path="../definitions/three.d.ts" />
/// <reference path="../visual/visual.ts" />
var Node_ = (function () {
    function Node_(firstArg, secondArg) {
        this.children = [];
        if (typeof firstArg == "string") {
            this.deserialize(JSON.parse(firstArg));
        }
        else if (firstArg.isRoot != null) {
            this.deserialize(firstArg);
        }
        else if (firstArg.isVector2 == true) {
            this.position = new FSArray(firstArg);
            this._isRoot = true;
            this.alpha = null;
            this.visual = new Visual();
        }
        else {
            this.length = firstArg;
            this.alpha = new FSArray(secondArg);
            this._isRoot = false;
            this.visual = new Visual();
            this.visual.rotate(secondArg);
            this.visual.setDotPosition(0, this.length);
        }
    }
    Node_.prototype.isRoot = function () {
        return this._isRoot;
    };
    Node_.prototype.draw = function (frame) {
        if (this._isRoot) {
            var position = this.position.get(frame);
            this.visual.position(position.x, -position.y);
            position = this.position.get(frame - 1 > 0 ? frame - 1 : 1);
            this.visual.position(position.x, -position.y, true);
        }
        else {
            this.visual.rotate(this.alpha.get(frame));
            this.visual.rotate(this.alpha.get(frame - 1 > 0 ? frame - 1 : 1), true);
        }
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.draw(frame);
        }
    };
    Node_.prototype.addChild = function (node) {
        this.children.push(node);
        node.parent_ = this;
        if (this.visual != null && node.visual != null) {
            this._addVisual(node.visual);
        }
    };
    Node_.prototype.setMode = function (mode) {
        this.applyToTree(function (mode) { this.visual.setMode(mode); }, mode);
    };
    Node_.prototype.manifest = function (frame) {
        if (this._isRoot)
            this.position.set(frame, this.position.get(frame));
        else
            this.alpha.set(frame, this.alpha.get(frame));
        this.applyToTree(function () {
            this.alpha.set(frame, this.alpha.get(frame));
        }, null);
    };
    Node_.prototype.applyToTree = function (func, arg) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.applyToTree(func, arg);
        }
        func.call(this, arg);
    };
    Node_.prototype.addVisual = function (object, phantom) {
        if (this.parent_ != null && this.parent_.visual != null) {
            this.visual.addPrimary(object);
            this.visual.addSecondary(phantom);
        }
    };
    Node_.prototype.getVisual = function (secondary) {
        if (secondary)
            return this.visual.getSecondary();
        else
            return this.visual.getPrimary();
    };
    Node_.prototype.setAlpha = function (alpha, frame) {
        if (this._isRoot)
            return;
        this.alpha.set(frame, alpha);
    };
    Node_.prototype.setPosition = function (x, y, frame) {
        if (this.isRoot) {
            this.position.set(frame, new THREE.Vector2(x, y));
        }
    };
    Node_.prototype.getRoot = function () {
        if (this._isRoot)
            return this;
        return this.parent_.getRoot();
    };
    Node_.prototype.getChild = function (idx) {
        return this.children[idx];
    };
    Node_.prototype.getProximityNodes = function (frame, radius, position) {
        return this._getProximityNodes(radius, 0, frame, position, new THREE.Vector2(0, 0));
    };
    ;
    Node_.prototype.activate = function () {
        this.visual.activate();
    };
    Node_.prototype.deactivate = function () {
        this.visual.deactivate();
    };
    Node_.prototype._getProximityNodes = function (radius, alpha, frame, position, anchor_position) {
        var beta = this._isRoot ? 0 : alpha + this.alpha.get(frame);
        var pos = this._isRoot ? this.position.get(frame) : new THREE.Vector2(-Math.sin(beta) * this.length, -Math.cos(beta) * this.length);
        var distance = position.distanceTo(pos);
        var dic = { "distance": distance, "node": this, "pivot": anchor_position, "alpha": alpha };
        var retValue = distance < radius ? dic : null;
        var position_new = position.clone();
        position_new.sub(pos);
        var anchor_position_new = anchor_position.clone();
        anchor_position_new.add(pos);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var node = _a[_i];
            var childeNode = node._getProximityNodes(radius, beta, frame, position_new, anchor_position_new);
            if (retValue != null) {
                if (childeNode != null) {
                    if (retValue.distance > childeNode.distance) {
                        retValue = childeNode;
                    }
                }
            }
            else {
                retValue = childeNode;
            }
        }
        return retValue;
    };
    Node_.prototype._addVisual = function (visual) {
        this.visual.add(visual);
        if (!this._isRoot) {
            visual.position(0, this.length);
            visual.position(0, this.length, true);
        }
    };
    Node_.prototype.serialize = function () {
        var retObject = {};
        retObject["isRoot"] = this._isRoot;
        retObject["position"] = this.position != null ? this.position.serialize() : null;
        retObject["length"] = this.length;
        retObject["alpha"] = this.alpha != null ? this.alpha.serialize() : null;
        retObject["visual"] = this.visual.serialize();
        var children = [];
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            children.push(child.serialize());
        }
        retObject["children"] = children;
        return retObject;
    };
    Node_.prototype.deserialize = function (object) {
        this._isRoot = object["isRoot"];
        this.length = object["length"];
        this.visual = Visual.deserialize(object["visual"]);
        this.alpha = FSArray.deserialize(object["alpha"]);
        this.position = FSArray.deserialize(object["position"]);
        for (var _i = 0, _a = object["children"]; _i < _a.length; _i++) {
            var child = _a[_i];
            var childNode = new Node_(child, this);
            this.addChild(childNode);
        }
    };
    return Node_;
}());
var FSArray = (function () {
    function FSArray(initial) {
        this.array = [initial];
    }
    FSArray.prototype.get = function (i) {
        while (this.array[i] == null) {
            i--;
        }
        return this.array[i];
    };
    FSArray.prototype.set = function (i, value) {
        this.array[i] = value;
    };
    FSArray.prototype.has = function (i) {
        return this.array[i] != null;
    };
    FSArray.prototype.serialize = function () {
        return this.array;
    };
    FSArray.deserialize = function (array) {
        if (array == null)
            return null;
        var retObject = new FSArray(null);
        retObject.array = array;
        return retObject;
    };
    return FSArray;
}());
var NodeMode;
(function (NodeMode) {
    NodeMode[NodeMode["Edit"] = 0] = "Edit";
    NodeMode[NodeMode["Play"] = 1] = "Play";
})(NodeMode || (NodeMode = {}));
