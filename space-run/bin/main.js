//
// Game Mode Toggling
//
var FPS = 30;
var TICK_MILI = 1000 / FPS;
var TICK_SECS = 1 / FPS;
var toggleMode = (function () {
    var old = null;
    return function (paused) {
        if (old !== null) {
            clearInterval(old);
        }
        if (paused) {
            old = null;
            World.drawer.drawPaused();
        }
        else {
            old = setInterval(GameMode, TICK_MILI);
        }
    };
})();
window.onload = function (ev) {
    var tmp = document.getElementById('dummy');
    tmp.parentNode.removeChild(tmp);
    World.init();
    init();
    toggleMode(true);
};
var Control;
(function (Control) {
    var VK;
    (function (VK) {
        VK[VK["W"] = 87] = "W";
        VK[VK["A"] = 65] = "A";
        VK[VK["S"] = 83] = "S";
        VK[VK["D"] = 68] = "D";
        VK[VK["P"] = 80] = "P";
        VK[VK["LEFT"] = 37] = "LEFT";
        VK[VK["RIGHT"] = 39] = "RIGHT";
        VK[VK["UP"] = 38] = "UP";
        VK[VK["DOWN"] = 40] = "DOWN";
        VK[VK["SPACE"] = 32] = "SPACE";
    })(VK || (VK = {}));
    ;
    var keys = [];
    var pause = true;
    function keyUp(e) {
        keys[e.keyCode] = false;
        if (pause || (!pause && e.keyCode === VK.P)) {
            pause = !pause;
            toggleMode(pause);
        }
    }
    ;
    function keyDown(e) {
        keys[e.keyCode] = true;
    }
    ;
    window.addEventListener("keyup", keyUp, true);
    window.addEventListener("keydown", keyDown, true);
    Control.left = false;
    Control.right = false;
    Control.up = false;
    Control.down = false;
    function checkKeys() {
        Control.left = keys[VK.LEFT] || keys[VK.A];
        Control.right = keys[VK.RIGHT] || keys[VK.D];
        Control.up = keys[VK.UP] || keys[VK.W];
        Control.down = keys[VK.DOWN] || keys[VK.S] || keys[VK.SPACE];
    }
    Control.checkKeys = checkKeys;
    ;
})(Control || (Control = {}));
;
var ship;
var actors;
function init() {
    ship = new Ship(World.W / 2, World.H / 2);
    actors = [ship];
    for (var i = 0; i < 3; ++i)
        actors.push(new CheckPoint());
}
;
function actions() {
    Control.checkKeys();
    if (Control.left)
        ship.left();
    if (Control.right)
        ship.right();
    if (Control.up && Control.down)
        ship.powerBrake(true);
    else {
        ship.powerBrake(false);
        if (Control.up)
            ship.fire();
        if (Control.down)
            ship.brake();
    }
}
;
function draw() {
    World.clearBackground();
    var d = World.drawer;
    for (var _i = 0; _i < actors.length; _i++) {
        var a = actors[_i];
        a.match(d);
    }
    d.drawHUD(ship.toString());
}
;
function GameMode() {
    actions();
    draw();
    var old = actors;
    actors = [];
    for (var _i = 0; _i < old.length; _i++) {
        var a = old[_i];
        a.match(playerCollider);
    }
    for (var _a = 0; _a < old.length; _a++) {
        var a = old[_a];
        a.tick(TICK_SECS);
        if (!a.dead())
            actors.push(a);
    }
}
;
