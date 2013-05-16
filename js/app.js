// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// The amount of time the game is played
var gameTime = 0;

// Speed in pixels per second
var playerSpeed = 100;

// The main game loop
var lastTime;

// The player
var player = {
    pos: [0, 0],
    //url, pos, size, speed, frames, dir, once
    sprite: new Sprite('img/syb.png', [0, 64], [32, 32], 0, [0, 1])
};

// Load the resources, initiate the game when they are properly loaded.
resources.load([
    'img/syb.png'
]);

resources.onReady(init);

/**
 * Initiate the game
 */
function init() {
    reset();
    lastTime = Date.now();
    main();
}

/**
 * The main function
 */
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

/**
 * This function updayes all the game objects
 */
function update(dt) {
    gameTime += dt;
    checkPlayerBounds();
    handleInput(dt);
    updateEntities(dt);

};

/**
 * Gives the player a new sprite, if it doesn't already have it.
 */
function newPlayerSprite(sprite) {
    var pos1 = player.sprite.pos[1] == sprite.pos[1];
    var pos0 = player.sprite.pos[0] == sprite.pos[0];

    if( (pos1 == false) || (pos0 == false)) {
        player.sprite = sprite;
    }

    // Make sure the player is moving when we change the sprite!
    player.sprite.speed = 2;
};

/**
 * This function handles input
 */
function handleInput(dt) {

    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
        newPlayerSprite(new Sprite('img/syb.png', [0, 64], [32, 32], 2, [0, 1]));
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
        newPlayerSprite(new Sprite('img/syb.png', [0, 96], [32, 32], 2, [0, 1]));
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
        newPlayerSprite(new Sprite('img/syb.png', [0, 32], [32, 32], 2, [0, 1]));
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
        newPlayerSprite(new Sprite('img/syb.png', [0, 0], [32, 32], 2, [0, 1]));
    }

    if(input.moving() == false) {
        
        if(input.somethingIsDown() == false) {
            newPlayerSprite(new Sprite('img/syb.png', [0, 64], [32, 32], 2, [0, 1]));
            player.sprite.speed = 0;
        }

    }
}

/**
 * Updates all of our entities
 */
function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);
}

/**
 * Makes sure the player stays within the canvas
 */
function checkPlayerBounds() {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

/**
 * Draws out everything on the canvas
 */
function render() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the player
    renderEntity(player);
};

/**
 * Renders a list of entities
 */
function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

/**
 * Renders a single entity
 */
function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

/**
 * Resets the game to its original state
 */
function reset() {
    player.pos = [50, canvas.height / 2];
};