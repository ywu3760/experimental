let cvs, ctx, rain;

function loadCanvas() {
    cvs = document.querySelector("canvas");
    ctx = cvs.getContext("2d");
    cvs.width = document.querySelector(".header").clientWidth;
    cvs.height = document.querySelector(".header").clientHeight;

    rain = new Rain;
    console.log([...rain.raindrops])
    newFrame();
}

window.addEventListener("resize", function(){
    cvs.width = document.querySelector(".header").clientWidth;
    cvs.height = document.querySelector(".header").clientHeight;
});

function newFrame() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = `rgba(0, 0, 0, 0)`;
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    rain.draw();
    window.requestAnimationFrame(newFrame);
}

function randNum(l, h) {
    return Math.floor(Math.random()*(h-l)) + l;
}

class Rain {
    constructor() {
        this.raindrops = [];
        for (var i=0; i<Math.floor(0.390625*cvs.width); i++) this.raindrops.push(new Raindrop);
    }
    draw() {
        this.raindrops.forEach(raindrop => {
            raindrop.move();
            raindrop.draw();
        });
        for (var i=0; i<this.raindrops.length; i++) if (this.raindrops[i].pos[0] < -10 || this.raindrops[i].pos[1] > cvs.height + 20) {
            this.raindrops.splice(i, 1);
            i--;
        }
        for (var i=0; i<Math.floor(0.390625*cvs.width)-this.raindrops.length; i++) this.raindrops.push(new Raindrop);
    }
}

class Raindrop {
    constructor() {
        this.pos = [randNum(10, 2*cvs.width), randNum(-10, -1.5*cvs.height)];
        this.oldPos = [...this.pos];
    }
    move() {
        this.oldPos = [...this.pos];
        this.pos[0]-= 6.75;
        this.pos[1]+= 35;
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.oldPos[0], this.oldPos[1]);
        ctx.strokeStyle = `rgba(255, 255, 255, ${randNum(0.4, 0.7)})`;
        ctx.lineWidth = 2.75*(cvs.width*cvs.height/780800);;
        ctx.lineTo(this.pos[0], this.pos[1]);
        ctx.stroke();
        ctx.closePath();
    }
}