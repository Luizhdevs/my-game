const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- VARIÁVEIS DE CONTROLE ---
const TOTAL_LEVELS = 10;
let currentLevel = 1;
let deathCount = 0;
let cameraX = 0;
let lastTime = 0;
let gameTimer = 0;
let gameTimerInterval;
let isGameFinished = false;

// 🎵 Sons do jogo
const sounds = {
    bgmusic: new Audio('assets/bgmusic.mp3'),
    jump: new Audio('assets/jump.mp3'),
    death: new Audio('assets/death.mp3'),
    door: new Audio('assets/door.mp3'),
    story: new Audio('assets/story.mp3')
};
sounds.bgmusic.loop = true;
sounds.bgmusic.volume = 0.3;
sounds.story.volume = 0.5;
sounds.jump.volume = 0.6;
sounds.death.volume = 0.8;
sounds.door.volume = 0.7;
document.addEventListener('click', () => {
    if (sounds.bgmusic.paused) sounds.bgmusic.play();
}, { once: true });

// =================================================================
// Classe de Animação
// =================================================================
class Animation {
    constructor(frames, frameDuration) {
        this.frames = frames;
        this.frameDuration = frameDuration;
        this.currentFrameIndex = 0;
        this.time = 0;
    }
    update(deltaTime) {
        this.time += deltaTime;
        if (this.time >= this.frameDuration) {
            this.time = 0;
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
        }
    }
    getCurrentFrame() {
        return this.frames[this.currentFrameIndex];
    }
}

// =================================================================
// Lógica de Pré-carregamento de Imagens
// =================================================================
const imagePaths = {
    idle: ['assets/idle.png'],
    run: ['assets/player_1.png', 'assets/player_2.png', 'assets/player_3.png', 'assets/player_4.png'],
    jump: ['assets/jump.png'],
};
let loadedImages = {};
let playerAnimations = {};
function loadImages() {
    const allPaths = Object.values(imagePaths).flat();
    let loadedCount = 0;
    return new Promise(resolve => {
        if (allPaths.length === 0) { resolve(); return; }
        allPaths.forEach(path => {
            const img = new Image();
            img.onload = () => {
                loadedImages[path] = img;
                loadedCount++;
                if (loadedCount === allPaths.length) resolve();
            };
            img.onerror = () => {
                console.error(`Erro ao carregar imagem: ${path}`);
                loadedCount++;
                if (loadedCount === allPaths.length) resolve();
            };
            img.src = path;
        });
    });
}
function setupAnimations() {
    playerAnimations.idle = new Animation(imagePaths.idle.map(path => loadedImages[path]), 200);
    playerAnimations.run = new Animation(imagePaths.run.map(path => loadedImages[path]), 100);
    playerAnimations.jump = new Animation(imagePaths.jump.map(path => loadedImages[path]), 100);
    playerAnimations.death = new Animation(['#ff0000', '#cc0000', '#990000', '#660000'], 150);
}

// =================================================================
// Classes de Entidades do Jogo
// =================================================================
class Player {
    constructor(x, y) {
        this.x = x; this.y = y; this.width = 55; this.height = 85;
        this.velocityY = 0; this.velocityX = 0; this.speed = 5; this.jumpPower = 15;
        this.isJumping = false; this.gravity = 0.6; this.currentState = 'idle';
        this.currentAnimation = playerAnimations.idle; this.facingRight = true;
        this.isDead = false; this.deathTimer = 0; this.maxDeathTime = 600;
        this.groundedGraceFrames = 0; // "Coyote Time"
    }
    changeState(newState) {
        if (this.currentState !== newState && playerAnimations[newState]) {
            this.currentState = newState;
            this.currentAnimation = playerAnimations[newState];
            this.currentAnimation.time = 0; this.currentAnimation.currentFrameIndex = 0;
        }
    }

    update(deltaTime, icePlatforms) {
        if (this.isDead) {
            this.deathTimer += deltaTime;
            // CORREÇÃO CRÍTICA: Garante que a animação existe antes de atualizar
            if (this.currentAnimation) {
                this.currentAnimation.update(deltaTime);
            }
            return;
        }

        if (this.groundedGraceFrames > 0) {
            this.groundedGraceFrames--;
        }

        this.velocityY += this.gravity;
        this.y += this.velocityY;

        let onIce = false;
        for (let icePlatform of icePlatforms) {
            if (this.isOnTopOf(icePlatform)) {
                onIce = true;
                break;
            }
        }

        if (!keysPressed['ArrowLeft'] && !keysPressed['ArrowRight']) {
            if (onIce) {
                this.velocityX *= 0.95;
            } else {
                this.velocityX = 0;
            }
        }
        if (Math.abs(this.velocityX) < 0.1) {
            this.velocityX = 0;
        }

        this.x += this.velocityX;

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > 2000) this.x = 2000 - this.width;
        if (this.y > canvas.height) this.die();

        cameraX = this.x - canvas.width / 4;
        if (cameraX < 0) cameraX = 0;
        if (cameraX > 2000 - canvas.width) cameraX = 2000 - canvas.width;

        if (this.isJumping) {
            this.changeState('jump');
        } else if (this.velocityX !== 0) {
            this.changeState('run');
        } else {
            this.changeState('idle');
        }
        if (this.currentAnimation) {
            this.currentAnimation.update(deltaTime);
        }
    }

    draw(offsetX) {
        const screenX = this.x - offsetX;
        if (!this.currentAnimation) return;
        const currentFrame = this.currentAnimation.getCurrentFrame();
        if (this.isDead) { const opacity = 1 - (this.deathTimer / this.maxDeathTime); ctx.globalAlpha = Math.max(0, opacity); }
        ctx.save();
        if (!this.facingRight) { ctx.translate(screenX + this.width, this.y); ctx.scale(-1, 1); this.drawFrame(currentFrame, 0, 0); }
        else { this.drawFrame(currentFrame, screenX, this.y); }
        ctx.restore(); ctx.globalAlpha = 1;
    }
    drawFrame(frame, x, y) {
        if (typeof frame === 'string') { ctx.fillStyle = frame; ctx.fillRect(x, y, this.width, this.height); }
        else if (frame instanceof Image) { ctx.drawImage(frame, x, y, this.width, this.height); }
    }
    moveLeft() { if (!this.isDead) { this.velocityX = -this.speed; this.facingRight = false; } }
    moveRight() { if (!this.isDead) { this.velocityX = this.speed; this.facingRight = true; } }
    stopMove() { }
    jump() {
        if (!this.isDead && (!this.isJumping || this.groundedGraceFrames > 0)) {
            this.velocityY = -this.jumpPower;
            this.isJumping = true;
            this.groundedGraceFrames = 0;
            playSound('jump');
        }
    }
    die() {
        if (this.isDead) return; this.isDead = true; this.velocityX = 0; this.velocityY = 0; this.gravity = 0;
        this.changeState('death'); deathCount++; document.getElementById('death-count').textContent = deathCount; playSound('death');
    }
    checkCollision(rect) { return this.x < rect.x + rect.width && this.x + this.width > rect.x && this.y < rect.y + rect.height && this.y + this.height > rect.y; }
    isOnTopOf(rect) { return this.x < rect.x + rect.width && this.x + this.width > rect.x && this.y + this.height > rect.y && this.y + this.height < rect.y + 20; }

    handlePlatformCollision(platforms) {
        this.isJumping = true;
        for (let platform of platforms) {
            if (this.velocityY >= 0 && this.checkCollision(platform) && (this.y + this.height) <= (platform.y + this.velocityY + 1)) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
                this.groundedGraceFrames = 5;
                if (platform instanceof MovingFallingPlatform && platform.isMoving) {
                    this.x += platform.speed;
                }
                return;
            }
        }
    }
}
class Platform {
    constructor(x, y, width, height, color = '#4d9aff') { this.x = x; this.y = y; this.width = width; this.height = height; this.color = color; }
    draw(offsetX) {
        const screenX = this.x - offsetX;
        if (screenX + this.width > 0 && screenX < canvas.width) { ctx.fillStyle = this.color; ctx.fillRect(screenX, this.y, this.width, this.height); }
    }
}
class BoosterPlatform extends Platform { constructor(x, y, width, height, boostPower = 30) { super(x, y, width, height, '#2ecc71'); this.boostPower = boostPower; } }
class IcePlatform extends Platform { constructor(x, y, width, height) { super(x, y, width, height, '#aed6f1'); } }
class GhostPlatform {
    constructor(x, y, width, height) { this.x = x; this.y = y; this.width = width; this.height = height; this.color = '#4d9aff'; }
    draw(offsetX, timestamp) {
        const screenX = this.x - offsetX;
        if (screenX + this.width > 0 && screenX < canvas.width) {
            const alpha = (timestamp % 1000) < 500 ? 0.8 : 0.3; ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color; ctx.fillRect(screenX, this.y, this.width, this.height); ctx.globalAlpha = 1.0;
        }
    }
}
class Spike {
    constructor(x, y, isVisible = false) { this.x = x; this.y = y; this.width = 30; this.height = 25; this.isVisible = isVisible; }
    draw(offsetX) {
        if (!this.isVisible) return; const screenX = this.x - offsetX;
        if (screenX + this.width > 0 && screenX < canvas.width) {
            ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.moveTo(screenX, this.y + this.height);
            ctx.lineTo(screenX + this.width / 2, this.y); ctx.lineTo(screenX + this.width, this.y + this.height);
            ctx.closePath(); ctx.fill();
        }
    }
    checkCollision(player) { if (!this.isVisible) return false; return player.checkCollision(this); }
}
class FallingFloor extends Platform {
    constructor(x, y, width, height) { super(x, y, width, height, '#808080'); this.isFalling = false; this.fallSpeed = 0; this.gravity = 0.3; }
    update() { if (this.isFalling) { this.fallSpeed += this.gravity; this.y += this.fallSpeed; } }
    trigger() { this.isFalling = true; }
    draw(offsetX) { this.color = this.isFalling ? '#ff6b6b' : '#808080'; super.draw(offsetX); }
}
class MovingFallingPlatform extends Platform {
    constructor(x, y, width, height, endX, speed, triggerX) {
        super(x, y, width, height, '#ff9f43');
        this.startX = x; this.endX = endX; this.speed = speed; this.triggerX = triggerX;
        this.isMoving = true; this.isFalling = false; this.fallSpeed = 0; this.gravity = 0.3;
        this.isActivated = false;
    }
    update() {
        if (this.isActivated && this.isMoving) {
            this.x += this.speed;
            if (this.x >= this.endX || this.x <= this.startX) { this.speed *= -1; }
            if (Math.abs(this.x - this.triggerX) < Math.abs(this.speed) * 2) {
                this.isMoving = false; setTimeout(() => { this.isFalling = true; }, 200);
            }
        }
        if (this.isFalling) { this.fallSpeed += this.gravity; this.y += this.fallSpeed; }
    }
    draw(offsetX) {
        if (this.isActivated) {
            if (this.isMoving && Math.abs(this.x - this.triggerX) < 50) { this.color = '#e74c3c'; }
            else if (this.isFalling) { this.color = '#e67e22'; }
            else { this.color = '#f1c40f'; }
        } else {
            this.color = '#ff9f43';
        }
        super.draw(offsetX);
    }
}
class Projectile {
    constructor(x, y, speedX) { this.x = x; this.y = y; this.width = 15; this.height = 15; this.speedX = speedX; }
    update() { this.x += this.speedX; }
    draw(offsetX) { ctx.fillStyle = '#ff4757'; ctx.fillRect(this.x - offsetX, this.y, this.width, this.height); }
}
class ShooterTrap {
    constructor(x, y, fireRate = 2000, direction = 'left') {
        this.x = x; this.y = y; this.width = 40; this.height = 40;
        this.fireRate = fireRate; this.lastShot = 0; this.direction = direction;
    }
    update(timestamp, projectiles) {
        if (timestamp - this.lastShot > this.fireRate) {
            this.lastShot = timestamp; const speed = this.direction === 'left' ? -7 : 7;
            projectiles.push(new Projectile(this.x, this.y + this.height / 4, speed));
        }
    }
    draw(offsetX) {
        const screenX = this.x - offsetX; ctx.fillStyle = '#576574'; ctx.fillRect(screenX, this.y, this.width, this.height);
        ctx.fillStyle = '#2f3640'; const cannonX = this.direction === 'left' ? this.x - 10 : this.x + this.width;
        ctx.fillRect(cannonX - offsetX, this.y + 10, 10, 20);
    }
}
class TrapDoor {
    constructor(x, y, width, height, id) {
        this.x = x; this.y = y; this.width = width; this.height = height; this.id = id;
        this.color = '#808080'; this.isOpen = false;
    }
    open() { this.isOpen = true; }
    draw(offsetX) {
        if (!this.isOpen) {
            const screenX = this.x - offsetX;
            if (screenX + this.width > 0 && screenX < canvas.width) {
                ctx.fillStyle = this.color; ctx.fillRect(screenX, this.y, this.width, this.height);
            }
        }
    }
}
class Trigger {
    constructor(x, y, width, height, targetId) {
        this.x = x; this.y = y; this.width = width; this.height = height;
        this.targetId = targetId; this.hasBeenTriggered = false;
    }
    check(player, trapDoors) {
        if (this.hasBeenTriggered) return;
        if (player.checkCollision(this)) {
            this.hasBeenTriggered = true;
            const targetDoor = trapDoors.find(door => door.id === this.targetId);
            if (targetDoor) {
                targetDoor.open();
            }
        }
    }
}
class Door {
    constructor(x, y) { this.x = x; this.y = y; this.width = 50; this.height = 70; }
    draw(offsetX) {
        const screenX = this.x - offsetX;
        if (screenX + this.width > 0 && screenX < canvas.width) {
            ctx.fillStyle = '#ffff00'; ctx.fillRect(screenX, this.y, this.width, this.height);
            ctx.fillStyle = '#ff9900'; ctx.beginPath(); ctx.arc(screenX + this.width - 8, this.y + this.height / 2, 4, 0, Math.PI * 2); ctx.fill();
        }
    }
    checkCollision(player) { return player.checkCollision(this); }
}

let player;
let platforms = [], spikes = [], fallingFloors = [], door;
let boosterPlatforms = [], icePlatforms = [], ghostPlatforms = [], shooterTraps = [], projectiles = [];
let movingFallingPlatforms = [], trapDoors = [], triggers = [];
let keysPressed = {};

function playSound(name) { if (sounds[name]) { const sound = sounds[name].cloneNode(); sound.volume = sounds[name].volume; sound.play().catch(() => { }); } }

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
    if (e.key === 'ArrowLeft') player.moveLeft(); if (e.key === 'ArrowRight') player.moveRight();
    if (e.key === ' ') { e.preventDefault(); player.jump(); }
});
document.addEventListener('keyup', (e) => { keysPressed[e.key] = false; player.stopMove(); });

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function startTimer() {
    if (gameTimerInterval) clearInterval(gameTimerInterval);
    const timeDisplay = document.getElementById('time-display');
    gameTimerInterval = setInterval(() => {
        if (!isGameFinished) {
            gameTimer++;
            timeDisplay.textContent = formatTime(gameTimer);
        }
    }, 1000);
}

function startGame() {
    isGameFinished = false;
    currentLevel = 1;
    deathCount = 0;
    gameTimer = 0;
    document.getElementById('level').textContent = `1/${TOTAL_LEVELS}`;
    document.getElementById('death-count').textContent = deathCount;
    document.getElementById('time-display').textContent = '00:00';
    document.getElementById('victory-screen').style.display = 'none';
    startTimer();
    resetLevel();
    requestAnimationFrame(gameLoop); // Inicia o loop aqui
}

function restartGame() {
    document.getElementById('victory-screen').style.display = 'none';
    startGame();
}

function finishGame() {
    isGameFinished = true;
    clearInterval(gameTimerInterval);
    document.getElementById('final-time').textContent = formatTime(gameTimer);
    document.getElementById('final-deaths').textContent = deathCount;
    document.getElementById('victory-screen').style.display = 'flex';
}

function resetLevel() {
    player = new Player(50, 450);
    platforms = []; spikes = []; fallingFloors = []; boosterPlatforms = []; icePlatforms = [];
    ghostPlatforms = []; shooterTraps = []; projectiles = []; movingFallingPlatforms = [];
    trapDoors = []; triggers = [];
    cameraX = 0;
    loadLevel(currentLevel);
}

function nextLevel() {
    playSound('door');
    if (currentLevel < TOTAL_LEVELS) {
        currentLevel++;
        document.getElementById('level').textContent = `${currentLevel}/${TOTAL_LEVELS}`;
        resetLevel();
    } else {
        finishGame();
    }
}

function loadLevel(levelNum) {
    if (!LEVELS[levelNum]) { console.error(`Nível ${levelNum} não encontrado!`); return; }
    const levelData = LEVELS[levelNum];
    levelData.platforms?.forEach(p => platforms.push(new Platform(p.x, p.y, p.width, p.height, p.color)));
    levelData.spikes?.forEach(s => spikes.push(new Spike(s.x, s.y, s.visible)));
    levelData.fallingFloors?.forEach(f => fallingFloors.push(new FallingFloor(f.x, f.y, f.width, f.height)));
    levelData.boosterPlatforms?.forEach(p => boosterPlatforms.push(new BoosterPlatform(p.x, p.y, p.width, p.height, p.boostPower)));
    levelData.icePlatforms?.forEach(p => icePlatforms.push(new IcePlatform(p.x, p.y, p.width, p.height)));
    levelData.ghostPlatforms?.forEach(p => ghostPlatforms.push(new GhostPlatform(p.x, p.y, p.width, p.height)));
    levelData.shooterTraps?.forEach(t => shooterTraps.push(new ShooterTrap(t.x, t.y, t.fireRate, t.direction)));
    levelData.movingFallingPlatforms?.forEach(p => movingFallingPlatforms.push(new MovingFallingPlatform(p.x, p.y, p.width, p.height, p.endX, p.speed, p.triggerX)));
    levelData.trapDoors?.forEach(d => trapDoors.push(new TrapDoor(d.x, d.y, d.width, d.height, d.id)));
    levelData.triggers?.forEach(t => triggers.push(new Trigger(t.x, t.y, t.width, t.height, t.targetId)));
    door = new Door(levelData.door.x, levelData.door.y);
}

function gameLoop(timestamp) {
    if (isGameFinished) {
        return;
    }

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fallingFloors.forEach(floor => floor.update());
    shooterTraps.forEach(trap => trap.update(timestamp, projectiles));
    movingFallingPlatforms.forEach(p => p.update());
    projectiles.forEach(proj => proj.update());
    triggers.forEach(trigger => trigger.check(player, trapDoors));

    if (player.isDead) {
        player.update(deltaTime, []);
        if (player.deathTimer >= player.maxDeathTime) {
            resetLevel();
        }
    } else {
        const allSolidPlatforms = [...platforms, ...icePlatforms, ...boosterPlatforms, ...fallingFloors, ...movingFallingPlatforms, ...trapDoors.filter(d => !d.isOpen)];
        player.handlePlatformCollision(allSolidPlatforms);
        player.update(deltaTime, icePlatforms);

        spikes.forEach(spike => {
            if (Math.abs(player.x - spike.x) < 200 && !spike.isVisible) spike.isVisible = true;
        });
        fallingFloors.forEach(floor => {
            if (player.isOnTopOf(floor) && !floor.isFalling) floor.trigger();
        });
    }

    platforms.forEach(p => p.draw(cameraX));
    icePlatforms.forEach(p => p.draw(cameraX));
    boosterPlatforms.forEach(p => p.draw(cameraX));
    ghostPlatforms.forEach(p => p.draw(cameraX, timestamp));
    fallingFloors.forEach(f => f.draw(cameraX));
    shooterTraps.forEach(t => t.draw(cameraX));
    movingFallingPlatforms.forEach(p => p.draw(cameraX));
    trapDoors.forEach(d => d.draw(cameraX));

    spikes.forEach(spike => {
        spike.draw(cameraX);
        if (spike.checkCollision(player) && !player.isDead) player.die();
    });

    projectiles.forEach((proj, index) => {
        proj.draw(cameraX);
        if (player.checkCollision(proj) && !player.isDead) player.die();
        if (proj.x < cameraX - 50 || proj.x > cameraX + canvas.width + 50) projectiles.splice(index, 1);
    });

    if (!player.isDead) {
        for (let booster of boosterPlatforms) {
            if (player.velocityY >= 0 && player.isOnTopOf(booster)) {
                player.velocityY = -booster.boostPower;
                player.isJumping = true;
                break;
            }
        }
        for (let p of movingFallingPlatforms) {
            if (player.isOnTopOf(p) && !p.isActivated) {
                p.isActivated = true;
            }
        }
    }

    door.draw(cameraX);
    if (door.checkCollision(player) && !player.isDead) {
        nextLevel();
    }

    player.draw(cameraX);

    requestAnimationFrame(gameLoop);
}

loadImages().then(() => {
    setupAnimations();
    startGame();
});
