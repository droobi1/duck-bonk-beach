
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const duckImg = new Image();
duckImg.src = 'assets/sprites/duck_sprite.png';
const goblinImg = new Image();
goblinImg.src = 'assets/sprites/goblin_sprite.png';

const bonkSound = new Audio('assets/sounds/bonk.ogg');
const jumpSound = new Audio('assets/sounds/jump.ogg');
const bgmSound = new Audio('assets/sounds/bgm.ogg');
bgmSound.loop = true;

let score = 0;
const scoreSpan = document.getElementById('scoreValue');

const duck = { x: 100, y: 500, width: 50, height: 50, vy: 0, jumpForce: -15, onGround: false, speed: 5 };
const goblin = { x: 700, y: 500, width: 50, height: 50, vx: -3 };

const gravity = 0.5;
let keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function startGame() {
  bgmSound.play();
  requestAnimationFrame(gameLoop);
}
duckImg.onload = startGame;

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (keys['ArrowLeft']) duck.x -= duck.speed;
  if (keys['ArrowRight']) duck.x += duck.speed;
  if (keys['Space'] && duck.onGround) {
    duck.vy = duck.jumpForce;
    duck.onGround = false;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }

  duck.vy += gravity;
  duck.y += duck.vy;

  if (duck.y + duck.height >= canvas.height) {
    duck.y = canvas.height - duck.height;
    duck.vy = 0;
    duck.onGround = true;
  }

  goblin.x += goblin.vx;
  if (goblin.x + goblin.width < 0) goblin.x = canvas.width;

  if (
    duck.x < goblin.x + goblin.width &&
    duck.x + duck.width > goblin.x &&
    duck.y < goblin.y + goblin.height &&
    duck.y + duck.height > goblin.y
  ) {
    if (duck.vy > 0) {
      score++;
      scoreSpan.textContent = score;
      bonkSound.currentTime = 0;
      bonkSound.play();
      goblin.x = canvas.width + Math.random() * 100;
      duck.vy = duck.jumpForce / 2;
    } else {
      score = 0;
      scoreSpan.textContent = score;
      goblin.x = canvas.width;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(duckImg, duck.x, duck.y, duck.width, duck.height);
  ctx.drawImage(goblinImg, goblin.x, goblin.y, goblin.width, goblin.height);
}
