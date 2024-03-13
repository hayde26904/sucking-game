let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let w = 50;
let h = 50;
let x = canvas.width / 2 - w / 2;
let y = canvas.height / 2 - h / 2;
let centerX = x + w / 2;
let centerY = y + h / 2;

let activeKeys = [];
let mouseX = 0;
let mouseY = 0;

let xv = 0;
let yv = 0;

let coins = [];

class Coin {
    constructor(x,y,xdir,ydir){
        this.x = x;
        this.y = y;
        this.w = Math.random() * 10 + 5;
        this.h = this.w;
        this.xdir = xdir;
        this.ydir = ydir;
        this.decel = 0.95;
        this.xv = this.xdir;
        this.yv = this.ydir;
        this.beingSucked = false;
        this.toDelete = false;
        this.dirtyNastyColors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B7D6B'];
        this.color = this.dirtyNastyColors[Math.floor(Math.random() * this.dirtyNastyColors.length)];
    }

    draw(){
        ctx.fillStyle = this.color;
        //ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#000';
    }

    update(){
        this.xv *= this.decel;
        this.yv *= this.decel;
        this.xv = Math.trunc(this.xv * 100) / 100;
        this.yv = Math.trunc(this.yv * 100) / 100;

        this.x += this.xv;
        this.y += this.yv;

        if(this.beingSucked){
            this.w-=0.5;
            this.h-=0.5;
        }

        if(this.w < 0 || this.h < 0){
            this.toDelete = true;
        }
    }
}

window.onload = function(){
    for(let i = 0; i < 10000; i++){
        coins.push(new Coin(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 50 - 25, Math.random() * 50 - 25));
    }
}


function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    centerX = x + w / 2;
    centerY = y + h / 2;

    //ctx.fillRect(x, y, w, h);
    x = mouseX - w / 2;
    y = mouseY - h / 2;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, w / 2, h / 2, 0, 0, 2 * Math.PI);
    ctx.fill();
    // ctx.fillRect(x, y, w, h);

    for(c in coins){
        let coin = coins[c];
        coin.draw();
        coin.update();
        if(coin.toDelete){
            coins.splice(c, 1);
        }

        let dx = coin.x - centerX;
        let dy = coin.y - centerY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < 100){
            let angle = Math.atan2(dy, dx);
            let tx = centerX + Math.cos(angle) * 200;
            let ty = centerY + Math.sin(angle) * 200;
            let ax = tx - coin.x;
            let ay = ty - coin.y;
            coin.xv += -ax / 50;
            coin.yv += -ay / 50;
            if(distance < 25){
                //coins.splice(c, 1);
                coin.beingSucked = true;
            }
        }
    }

}

setInterval(update, 1000 / 60);

function keyDown(key) {
    return activeKeys.includes(key);
}

document.addEventListener('keydown', function (event) {
    if (!activeKeys.includes(event.key)) {
        activeKeys.push(event.key);
    }
});

document.addEventListener('keyup', function (event) {
    activeKeys = activeKeys.filter(key => key !== event.key);
});

document.addEventListener('mousemove', function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});