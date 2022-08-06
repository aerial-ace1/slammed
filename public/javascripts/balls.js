function drawScreen() {

    context.fillStyle = '#EEEEEE';
    context.fillRect(0, 0, theCanvas.width, theCanvas.height);
    //Box
    //context.strokeStyle = '#000000';
    context.strokeRect(1, 1, theCanvas.width - 2, theCanvas.height - 2);

    //Place balls

    
    let ball;

    for (let i = 0; i < balls.length; i++) {
        context.fillStyle = randomColor(colors);
        ball = balls[i];
        ball.x += ball.xunits;
        ball.y += ball.yunits;

        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();

        if (ball.x > theCanvas.width || ball.x < 0) {
            ball.angle = 180 - ball.angle;
            updateBall(ball);
        } else if (ball.y > theCanvas.height || ball.y < 0) {
            ball.angle = 360 - ball.angle;
            updateBall(ball);
        }
    }

}

function updateBall(ball) {

    ball.radians = ball.angle * Math.PI / 180;
    ball.xunits = Math.cos(ball.radians) * ball.speed;
    ball.yunits = Math.sin(ball.radians) * ball.speed;

}

let numBalls = 100;
let maxSize = 8;
let minSize = 5;
let maxSpeed = maxSize + 5;
let balls = new Array();
let tempBall;
let tempX;
let tempY;
let tempSpeed;
let tempAngle;
let tempRadius;
let tempRadians;
let tempXunits;
let tempYunits;

theCanvas = document.getElementById('canvas');
context = theCanvas.getContext('2d');

theCanvas.width = innerWidth
theCanvas.height = innerHeight

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
  
    gameLoop()
})

for (let i = 0; i < numBalls; i++) {
    tempRadius = Math.floor(Math.random() * maxSize) + minSize;
    tempX = tempRadius * 2 + (Math.floor(Math.random() * theCanvas.width) - tempRadius * 2);
    tempY = tempRadius * 2 + (Math.floor(Math.random() * theCanvas.height) - tempRadius * 2);
    tempSpeed = maxSpeed - tempRadius;
    tempAngle = Math.floor(Math.random() * 360);
    tempRadians = tempAngle * Math.PI / 180;
    tempXunits = Math.cos(tempRadians) * tempSpeed;
    tempYunits = Math.sin(tempRadians) * tempSpeed;

    tempBall = {
        x: tempX,
        y: tempY,
        radius: tempRadius,
        speed: tempSpeed,
        angle: tempAngle,
        xunits: tempXunits,
        yunits: tempYunits
    }
    balls.push(tempBall);
}

function gameLoop() {
    window.setTimeout(gameLoop, 100);
    drawScreen()
}

gameLoop();