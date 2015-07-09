var PI = Math.PI;
var TWO_PI = 2 * Math.PI;
var Random = Math.random;
var MAX_R = 32;
var MAX_POWER = 150;
var MAX_SPEED = 250;
var FIRE = 5;
var BRAKE = 0.9;
var SMOKE_COLOR = ['rgba(37,37,37,', 'rgba(21,21,21,'];
var SMOKE_F = 0.99;
var SMOKE_MAX = 5;
var GUE_F = 0.98;
var GUE_MAX = 30;
var GUE_COLOR = 'rgba(0,255,0,';
var CHECKPOINT_MAX = 9.99;
var CHECKPOINT_R = 30;
var SPARK_T = 3;
var SPARK_F = 0.99;
var SPARK_SIZE = 1;
var POINTS_MAX = 3;
var TRIANGLE = [[-5, -5], [-5, 5], [15, 0]];
var MISSILE = [[-4, -4], [-4, 4], [8, 4], [12, 0], [8, -4]];
;
var World;
(function (World) {
    World.FONT_H = 8;
    World.FONT_HEIGHT = World.FONT_H * 1.5 + 4;
    var ctx;
    World.W = window.innerWidth - 4;
    World.H = window.innerHeight - 4;
    World.debug = false;
    function init() {
        var canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        var parameters = document.URL.split('?');
        if (parameters.length > 1) {
            parameters = parameters[1].split('&');
            for (var i = 0; i < parameters.length; ++i) {
                var tmp = parameters[i].split('=');
                if (tmp.length > 1) {
                    var option = tmp[0];
                    var value = tmp[1];
                    switch (option) {
                        case 'w':
                            World.W = parseInt(value);
                            break;
                        case 'h':
                            World.H = parseInt(value);
                            break;
                        case 'd':
                        case 'debug':
                            World.debug = (value.toLowerCase() === 'true');
                        default:
                            break;
                    }
                }
            }
        }
        ctx.canvas.width = World.W;
        ctx.canvas.height = World.H;
        ctx.font = World.FONT_H + 'pt testFont';
    }
    World.init = init;
    ;
    var background = null;
    function clearBackground() {
        if (background !== null) {
            ctx.putImageData(background, 0, 0);
        }
        else {
            ctx.fillStyle = "#222244";
            ctx.fillRect(0, 0, World.W, World.H);
            for (var i = 0; i < 150; ++i) {
                var x = Math.random() * World.W;
                var y = Math.random() * World.H;
                var s = Math.random() + 1;
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, s, 0, TWO_PI, false);
                ctx.fillStyle = '#EDD879';
                ctx.fill();
                ctx.restore();
            }
            background = ctx.getImageData(0, 0, World.W, World.H);
        }
    }
    World.clearBackground = clearBackground;
    ;
    var MSG = [
        'SPACE RUN',
        '',
        '',
        '-- Game Paused --',
        'Press any key to continue.',
        '',
        '-- Objective --',
        'Pop all circular gue...',
        'Warning: green gue slows you down.',
        '',
        '-- Controls --',
        '       Left: a OR <left arrow>            ',
        '      Right: d OR <right arrow>           ',
        '    Engines: w OR <up arrow>              ',
        '      Brake: s OR space OR <down arrow>   ',
        "Power-Brake: hold 'fire engines' & 'brake'"
    ];
    function drawPath(path) {
        ctx.beginPath();
        var _a = path[0], x = _a[0], y = _a[1];
        ctx.moveTo(x, y);
        for (var i = 0; i < path.length; ++i) {
            _b = path[i], x = _b[0], y = _b[1];
            ctx.lineTo(x, y);
        }
        ctx.lineJoin = 'miter';
        ctx.closePath();
        var _b;
    }
    ;
    World.drawer = {
        drawHUD: function (shipStatus) {
            ctx.save();
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fillRect(0, 0, World.W, World.FONT_H * 1.5 + 4);
            ctx.fillStyle = 'white';
            ctx.lineWidth = 1;
            ctx.fillText(shipStatus, 4, World.FONT_H * 1.5 + 2);
            ctx.restore();
        },
        drawPaused: function () {
            clearBackground();
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, World.W, World.H);
            ctx.fillStyle = 'white';
            ctx.lineWidth = 1;
            for (var i = 0; i < MSG.length; ++i) {
                var txt = MSG[i];
                if (i === 0) {
                    ctx.font = 40 + 'pt testFont';
                }
                else {
                    ctx.font = World.FONT_H + 'pt testFont';
                }
                ctx.fillText(txt, (World.W / 2) - (ctx.measureText(txt).width / 2), (World.H / 2 - (World.FONT_HEIGHT * MSG.length / 2)) + (World.FONT_HEIGHT * i));
            }
        },
        caseGue: function (g) {
            var df = g.t / GUE_MAX;
            ctx.save();
            ctx.beginPath();
            ctx.arc(g.p.x, g.p.y, g.s, 0, TWO_PI, false);
            ctx.fillStyle = GUE_COLOR + df + ')';
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        },
        caseShip: function (s) {
            ctx.save();
            var angle = s.angle();
            ctx.translate(s.p.x, s.p.y);
            ctx.rotate(angle);
            if (Control.up && !Control.down) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(-5, -4);
                ctx.lineTo(-5, 4);
                ctx.lineTo(-14 - (Random() * 2), 0);
                ctx.closePath();
                ctx.fillStyle = "rgba(256, 236, 80, " + (Random() * 0.5 + 0.5) + ")";
                ctx.fill();
                ctx.restore();
                var xx = s.p.x - (Math.cos(angle) * 17);
                var yy = s.p.y - (Math.sin(angle) * 17);
                actors.push(new Smoke(xx, yy, Math.cos(angle), Math.sin(angle)));
            }
            drawPath(s.shape);
            ctx.fillStyle = '#ff2020';
            ctx.fill();
            if (Control.up && Control.down) {
                ctx.lineWidth = 4;
                ctx.lineJoin = 'round';
                ctx.strokeStyle = "rgba(80, 236, 256, " + (Random() * 0.6 + 0.4) + ")";
            }
            else {
                if (Control.down) {
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'rgba(255,20,20,0.2)';
                }
                else {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#ffbbbb';
                }
            }
            ctx.stroke();
            ctx.restore();
        },
        casePoints: function (p) {
            var df = (p.t / POINTS_MAX);
            ctx.save();
            ctx.fillStyle = (Random() < 0.5 ? 'rgba(255,255,0' : 'rgba(255,255,255') + ',' + (df + 0.1) + ')';
            var text = p.val;
            ctx.font = p.s + 'pt testFont';
            ctx.fillText(text, p.x - ctx.measureText(text).width / 2, p.y + (World.FONT_H * 1.5) / 2);
            ctx.restore();
        },
        caseSpark: function (s) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(s.p.x, s.p.y, SPARK_SIZE, 0, TWO_PI, false);
            ctx.closePath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.fillStyle = 'rgba(255,255,0,' + ((s.t / SPARK_T) + 0.1) + ')';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        },
        caseSmoke: function (s) {
            var df = (s.t / SMOKE_MAX);
            var size = 15 - 12 * df;
            ctx.save();
            ctx.beginPath();
            ctx.arc(s.p.x, s.p.y, size, 0, TWO_PI, false);
            ctx.fillStyle = s.c + (df + 0.01) + ')';
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        },
        caseCheckPoint: function (cp) {
            var df = cp.t / CHECKPOINT_MAX;
            ctx.save();
            ctx.beginPath();
            ctx.arc(cp.p.x, cp.p.y, cp.r, 0, TWO_PI, false);
            ctx.lineWidth = 3 * (df) + 1;
            ctx.strokeStyle = 'rgba(' + Math.round(255 * (1 - df)) + ',' + Math.round(255 * df)
                + ',128,' + (df < 0.5 ? (1 - df) : df) + ')';
            ctx.fillStyle = 'rgba( 0,' + Math.round(255 * (1 - df))
                + ',' + Math.round(255 * df) + ',' + (df < 0.5 ? (1 - df) : df) + ')';
            ctx.fill();
            ctx.stroke();
            if (World.debug) {
                ctx.fillStyle = (df < 0.5 ? 'yellow' : 'white');
                var text = cp.t.toFixed(1);
                ctx.fillText(text, cp.p.x - ctx.measureText(text).width / 2, cp.p.y + (World.FONT_H * 1.5) / 2);
            }
            ctx.restore();
        }
    };
})(World || (World = {}));
;
function collides(ship, p, r) {
    var xx = ship.p.x - p.x;
    var yy = ship.p.y - p.y;
    var rr = ship.radius + r;
    if (xx * xx + yy * yy > rr * rr)
        return false;
    var tmp = ship.shape.map(function (x) { return ship.rot(x[0], x[1]); });
    for (var i = 0; i < tmp.length; ++i) {
        if (inters(tmp[i], tmp[(i + 1) % tmp.length], p, r))
            return true;
    }
    return false;
}
function inters(p0, p1, c, cw) {
    var x0 = c.x;
    var y0 = c.y;
    var x1 = p0.x;
    var y1 = p0.y;
    var x2 = p1.x;
    var y2 = p1.y;
    var n = Math.abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1));
    var d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var dist = n / d;
    if (dist > cw)
        return false;
    var d1 = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
    if ((d1 - cw) > d)
        return false;
    var d2 = Math.sqrt(Math.pow(x0 - x2, 2) + Math.pow(y0 - y2, 2));
    if ((d2 - cw) > d)
        return false;
    return true;
}
;
function fix(str, length) {
    var tmp = str;
    while (tmp.length < length) {
        tmp = ' ' + tmp;
    }
    return tmp;
}
;
var playerCollider = {
    caseGue: function (g) {
        if (collides(ship, g.p, g.s)) {
            ship.slowdown(0.8 + (1 - 0.8) * (1 - g.t / GUE_MAX));
        }
    },
    caseCheckPoint: function (cp) {
        if (collides(ship, cp.p, cp.r)) {
            var val = cp.t * 10;
            ship.addPoints(val);
            cp.t = 0;
            var sp = Random() * 10 + 10;
            while (sp-- > 0)
                actors.push(new Spark(cp.p.x, cp.p.y, Random() * TWO_PI));
            actors.push(new CheckPoint());
            actors.push(new Points(cp.p.x, cp.p.y, ('+' + val.toFixed(1) + '!')));
        }
    },
    caseShip: function (s) { },
    caseSpark: function (s) { },
    caseSmoke: function (s) { },
    casePoints: function (p) { },
};
;
;
var Ship = (function () {
    function Ship(x, y) {
        this.power = null;
        this.p = { x: x, y: y };
        this.v = { x: 0, y: 0 };
        this.r = 0;
        this.score = 0;
        this.timer = 0;
        this.max = 0;
        this.radius = 15;
        this.shape = TRIANGLE;
    }
    Ship.prototype.rot = function (x, y) {
        var cos_angle = Math.cos(this.angle());
        var sin_angle = Math.sin(this.angle());
        return {
            x: (x * cos_angle - y * sin_angle) + this.p.x,
            y: (x * sin_angle + y * cos_angle) + this.p.y
        };
    };
    Ship.prototype.addPoints = function (p) {
        this.score += p;
        this.timer += 3;
    };
    Ship.prototype.getVel = function () {
        return Math.sqrt(Math.pow(this.v.x, 2) + Math.pow(this.v.y, 2));
    };
    Ship.prototype.setVel = function (pow) {
        this.v.x = pow * Math.cos(this.angle());
        this.v.y = pow * Math.sin(this.angle());
    };
    Ship.prototype.addVel = function (pow) {
        this.v.x += pow * Math.cos(this.angle());
        this.v.y += pow * Math.sin(this.angle());
    };
    Ship.prototype.angle = function () {
        return TWO_PI / MAX_R * this.r;
    };
    Ship.prototype.left = function () {
        this.r = (this.r - 1) % MAX_R;
    };
    Ship.prototype.right = function () {
        this.r = (this.r + 1) % MAX_R;
    };
    Ship.prototype.fire = function () {
        this.v.x += FIRE * Math.cos(this.angle());
        this.v.y += FIRE * Math.sin(this.angle());
        if (this.getVel() > MAX_SPEED) {
            this.slowdown(GUE_F);
        }
    };
    Ship.prototype.brake = function () {
        this.v.x *= BRAKE;
        this.v.y *= BRAKE;
    };
    Ship.prototype.slowdown = function (friction) {
        this.v.x *= friction;
        this.v.y *= friction;
    };
    Ship.prototype.powerBrake = function (isOn) {
        if (!isOn && this.power !== null) {
            this.addVel(this.power);
            this.power = null;
            return;
        }
        if (isOn) {
            if (this.power === null) {
                this.
                    power = 0;
            }
            var tmp = this.getVel();
            this.brake();
            tmp -= this.getVel();
            this.power += tmp;
        }
    };
    Ship.prototype.tick = function (t) {
        this.p.x += this.v.x * t;
        this.p.y += this.v.y * t;
        this.timer -= t;
        var H = World.H;
        var W = World.W;
        if (this.timer <= 0) {
            if (this.score > 0) {
                if (this.max >= this.score)
                    actors.push(new Points(W / 2, H / 2, 'SCORE RESET', 40));
                else
                    actors.push(new Points(W / 2, H / 2, 'NEW RECORD!!', 50));
                this.max = Math.max(this.max, this.score);
                this.score = 0;
            }
            this.timer = 0;
        }
        if (this.p.x < 0)
            this.p.x = W;
        if (this.p.x > W)
            this.p.x = 0;
        if (this.p.y < 0)
            this.p.y = H;
        if (this.p.y > H)
            this.p.y = 0;
    };
    Ship.prototype.dead = function () {
        return false;
    };
    Ship.prototype.toString = function () {
        var score = 'score: ' + fix(this.score.toFixed(1), 5) + ' '
            + (this.timer > 0 ? 'timeout: ' + this.timer.toFixed(1) + 's' : '(max: ' + this.max.toFixed(1) + ')');
        if (!World.debug)
            return score;
        var xx = (this.p.x).toFixed(1);
        var yy = (this.p.y).toFixed(1);
        var vv = this.getVel().toFixed(1);
        var pp = this.power !== null ? '(' + this.power.toFixed(1) + ')' : '';
        return score + ' pos=(' + fix(xx, 6) +
            ', ' + fix(yy, 6) + ') vel=' + fix(vv, 6) + ' ' + pp;
    };
    Ship.prototype.match = function (m) {
        return m.caseShip(this);
    };
    return Ship;
})();
;
var CheckPoint = (function () {
    function CheckPoint() {
        this.t = CHECKPOINT_MAX;
        var x = Random() * (World.W - CHECKPOINT_R * 2) + CHECKPOINT_R;
        var y = Random() * (World.H - CHECKPOINT_R * 2) + CHECKPOINT_R;
        this.p = { x: x, y: y };
        this.r = (1 - this.t / CHECKPOINT_MAX) * CHECKPOINT_R + 2;
    }
    CheckPoint.prototype.dead = function () {
        return this.t <= 0;
    };
    CheckPoint.prototype.tick = function (time) {
        if (this.dead())
            return;
        this.t -= time;
        this.r = (1 - this.t / CHECKPOINT_MAX) * CHECKPOINT_R + 2;
        if (this.dead()) {
            actors.push(new CheckPoint());
            var gues = Random() * 4 + 2;
            while (gues-- > 0)
                actors.push(new Gue(this.p.x, this.p.y));
        }
    };
    CheckPoint.prototype.match = function (m) {
        return m.caseCheckPoint(this);
    };
    return CheckPoint;
})();
;
var Smoke = (function () {
    function Smoke(x, y, vx, vy) {
        this.c = SMOKE_COLOR[Math.floor(Random() * SMOKE_COLOR.length)];
        this.p = { x: x + ((Random() * 5) - 2), y: y + ((Random() * 5) - 2) };
        this.v = { x: (Random() * 10 + 5) * vx, y: (Random() * 10 + 5) * vy };
        this.t = SMOKE_MAX;
    }
    Smoke.prototype.dead = function () {
        return this.t <= 0;
    };
    Smoke.prototype.tick = function (time) {
        this.t -= time;
        this.p.x += this.v.x * time;
        this.p.y += this.v.y * time;
        this.v.x *= SMOKE_F;
        this.v.y *= SMOKE_F;
    };
    Smoke.prototype.match = function (m) {
        return m.caseSmoke(this);
    };
    return Smoke;
})();
;
var Gue = (function () {
    function Gue(x, y) {
        this.angle = TWO_PI * Random();
        this.size = Random() * 20 + 30;
        this.speed = Random() * 20;
        this.p = { x: x, y: y };
        this.v = { x: Math.cos(this.angle) * this.speed, y: Math.sin(this.angle) * this.speed };
        this.t = GUE_MAX;
        this.s = this.size - 10 * (this.t / GUE_MAX);
    }
    Gue.prototype.dead = function () {
        return this.t <= 0;
    };
    Gue.prototype.tick = function (time) {
        this.t -= time;
        this.s = this.size - 10 * (this.t / GUE_MAX);
        this.p.x += this.v.x * time;
        this.p.y += this.v.y * time;
        this.v.x *= GUE_F;
        this.v.y *= GUE_F;
    };
    Gue.prototype.match = function (m) {
        return m.caseGue(this);
    };
    return Gue;
})();
;
var Points = (function () {
    function Points(x, y, val, s) {
        this.x = x;
        this.y = y;
        this.val = val;
        this.s = s;
        this.p = { x: x, y: y };
        this.t = POINTS_MAX;
        if (s === undefined)
            this.s = World.FONT_H;
    }
    Points.prototype.dead = function () {
        return this.t <= 0;
    };
    Points.prototype.tick = function (time) {
        this.t -= time;
    };
    Points.prototype.match = function (m) {
        return m.casePoints(this);
    };
    return Points;
})();
;
var Spark = (function () {
    function Spark(x, y, angle) {
        this.p = { x: x + ((Random() * 5) - 2), y: y + ((Random() * 5) - 2) };
        this.v = { x: Math.cos(angle) * 12, y: Math.sin(angle) * 12 };
        this.t = SPARK_T;
    }
    Spark.prototype.dead = function () {
        return this.t <= 0;
    };
    Spark.prototype.tick = function (time) {
        this.t -= time;
        this.p.x += this.v.x * time;
        this.p.y += this.v.y * time;
        this.v.x *= SPARK_F;
        this.v.y *= SPARK_F;
    };
    Spark.prototype.match = function (m) {
        return m.caseSpark(this);
    };
    return Spark;
})();
;
