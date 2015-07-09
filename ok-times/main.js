var RandomQuestion;
(function (RandomQuestion) {
    // TODO finish copying table
    //from http://www.bbc.com/news/blogs-magazine-monitor-28143553
    //from http://www.bbc.com/news/magazine-32299402
    // note that '01' (binary notation) is 1. used for matching lengths
    var WEIGHTS = [
        01, 01, 01, 01, 01, 01, 01, 10, 01, 01, 01,
        01, 01, 10, 01, 30, 30, 30, 30, 01, 01, 10,
        01, 01, 20, 01, 40, 40, 60, 40, 01, 01, 40,
        01, 01, 01, 01, 01, 10, 10, 10, 01, 01, 30,
        01, 01, 10, 40, 10, 50, 70, 80, 01, 01, 80,
        01, 01, 10, 40, 10, 50, 70, 80, 01, 01, 80,
        01, 01, 10, 60, 80, 80, 90, 90, 01, 01, 80,
        01, 01, 10, 50, 70, 80, 80, 80, 01, 01, 80,
        01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01,
        01, 01, 10, 40, 10, 50, 70, 01, 80, 01, 10,
        01, 01, 10, 40, 10, 50, 70, 70, 60, 10, 80,
    ];
    var MAX = WEIGHTS.reduce(function (old, curr) { return old + curr; }, 0);
    function ask() {
        // random = [0, 1[
        var rd = Math.round(MAX * Math.random());
        var accum = 0;
        for (var i = 0; i < WEIGHTS.length; ++i) {
            accum += WEIGHTS[i];
            if (accum >= rd) {
                // floor is intentional to ensure 0..11 on same 'x'
                return [Math.floor(i / 11) + 2, (i % 11) + 2];
            }
        }
        throw ('Error: did not find question.' + rd + ' ' + MAX + ' ' + accum);
    }
    RandomQuestion.ask = ask;
    ;
})(RandomQuestion || (RandomQuestion = {}));
;
var SequentialQuestion;
(function (SequentialQuestion) {
    var aux = 0;
    function ask() {
        var i = aux; // increments to next
        aux = (aux + 1) % (11 * 11);
        return [Math.floor(i / 11) + 2, (i % 11) + 2];
    }
    SequentialQuestion.ask = ask;
    ;
})(SequentialQuestion || (SequentialQuestion = {}));
;
/*
module Test {

    export function testRandomQuestion() {

        let tmp = {};
        let i = 10000;
        while (i-- > 0) {
            const [x, y] = RandomQuestion.ask();
            const m = x + '*' + y;
            tmp[m] = tmp[m] === undefined ? 0 : tmp[m] + 1;
            //	console.log(m);
        }

        for (let i = 2; i <= 12; i++) {
            let s = '';
            for (let j = 2; j <= 12; j++) {
                const v = tmp[i + '*' + j];
                if (v === undefined)
                    s += '\t' + 0;
                else
                    s += '\t' + v;
            }
            console.log(s);
        }

    };

    export function testSequentialQuestion() {
        let i = 12 * 12;
        while (i-- > 0) {
            console.log(SequentialQuestion.ask());
        }
    };

};
*/
window.onload = function () {
    var html_mode = document.getElementById('mode');
    var html_score = document.getElementById('score');
    var html_points = document.getElementById('points');
    var html_question = document.getElementById('question');
    var html_attempt = document.getElementById('attempt');
    var html_answer = document.getElementById('answer');
    var html_add = document.getElementById('add');
    var score = 0;
    var help = true;
    var attempt = '';
    var answer = '';
    var question = '';
    var wrong = 0;
    var timer = 0;
    var ask = null;
    var mode = '';
    var add = 0;
    function nextQuestion() {
        var _a = ask(), x = _a[0], y = _a[1];
        attempt = '';
        answer = (x * y).toString();
        question = x + ' &times; ' + y;
        timer = 0;
    }
    ;
    function switchQuestionFormat() {
        mode = ask === RandomQuestion.ask ? 'Sequential' : 'Random';
        ask = ask === RandomQuestion.ask ? SequentialQuestion.ask : RandomQuestion.ask;
        nextQuestion();
    }
    ;
    function addNumber(n) {
        var tmp = attempt + n.toString();
        if (answer.indexOf(tmp) !== 0) {
            wrong = 200;
        }
        attempt = tmp;
    }
    ;
    window.onkeyup = function (e) {
        if (e.keyCode === 13) {
            nextQuestion();
            return;
        }
        if (e.keyCode === 72) {
            help = !help;
            return;
        }
        if (e.keyCode === 81) {
            switchQuestionFormat();
            return;
        }
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            addNumber(e.keyCode - 48);
            return;
        }
    };
    window.onresize = function () {
        var W = window.innerWidth;
        var H = window.innerHeight;
        // fractions of the H
        var F = Math.round(H / 12);
        html_question.style.paddingTop = F + 'px';
        html_question.style.fontSize = 2 * F + 'px';
        html_attempt.style.paddingTop = 4 * F + 'px';
        html_attempt.style.fontSize = 5 * F + 'px';
        html_answer.style.paddingTop = html_attempt.style.paddingTop;
        html_answer.style.fontSize = html_attempt.style.fontSize;
    };
    window.onresize(null);
    html_mode.onclick = function () {
        switchQuestionFormat();
    };
    html_score.onclick = function () {
        help = !help;
    };
    var past = Date.now();
    function draw() {
        var now = Date.now();
        var dt = now - past;
        past = now;
        if (wrong > 0) {
            html_attempt.style.color = "red";
        }
        else {
            html_attempt.style.color = "black";
        }
        html_question.innerHTML = question;
        var padded_attempt = attempt;
        while (padded_attempt.length < answer.length) {
            padded_attempt = padded_attempt + ' ';
        }
        html_attempt.innerHTML = padded_attempt;
        if (help) {
            // help if too much time without correct answer
            html_answer.style.textShadow = "0px 0px 15px rgba(99, 99, 99, " + Math.min(((timer - 4000) / 9000), 0.5) + ")";
            html_answer.innerHTML = answer;
        }
        else {
            html_answer.style.textShadow = "none";
        }
        // timer
        var max = 10 + (timer < 6000 ? Math.round(50 * (1 - ((timer + 1) / 6000))) : 0);
        html_mode.innerHTML = mode;
        html_score.innerHTML = (help ? ' [help on] ' : '') + 'score: ' + score;
        html_points.innerHTML = 'max. points: ' + max + ' (' + (Math.round(timer / 1000)) + 's)';
        if (attempt === answer) {
            score += max;
            add = 1500;
            html_add.innerHTML = '+' + max + '!';
            nextQuestion();
        }
        if (wrong > 0) {
            wrong -= dt;
            if (wrong <= 0) {
                attempt = '';
            }
        }
        if (add > 0) {
            add -= dt;
            if (add <= 0) {
                html_add.innerHTML = '';
            }
        }
        timer += dt;
        requestAnimationFrame(draw);
    }
    ;
    switchQuestionFormat();
    draw();
};
