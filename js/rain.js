const canvas = document.createElement('canvas');
canvas.id = 'rain-canvas';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

const drops = Array.from({length: 200}, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    l: 10 + Math.random() * 20,
    xs: -2 + Math.random() * 4,
    ys: 4 + Math.random() * 4
}));

function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.xs, d.y + d.l);
    }
    ctx.stroke();
    move();
}

function move() {
    for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.x += d.xs;
        d.y += d.ys;
        if (d.y > height) {
            d.x = Math.random() * width;
            d.y = -20;
        }
    }
}

function loop() {
    draw();
    requestAnimationFrame(loop);
}
loop(); 