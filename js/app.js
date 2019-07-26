// Random Enemy Speed
let randomSpeed = () => Math.floor(Math.random() * 301) + 100;
// Array for Enemies
const allEnemies = [];

// Character Selection Menu, Lives, Lost Screen
const options = document.querySelector('.select');
const lives = document.querySelector('.lives');
const stars = document.querySelector('.stars');
const lostPopup = document.querySelector('.lostPopup');
// Default Character
let charChoice = 'images/char-boy.png';

// Random Gem Locations
let min = [0, 101, 202, 303, 404];
let max = [130, 215, 300];
// Gem Location
let random = (array) => {
    let place = array[Math.floor(Math.random()*array.length)];
    let x = array.indexOf(place);
    array.splice(x, 1);
    return place;
}

/* Timer */
const timer = document.querySelector('.timer');
let counting, seconds = 0, minutes = 0;

// Enemies our player must avoid
class Enemy {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    constructor(x, y, speed) {
        // Starting Position
        this.x = x;
        this.y = y + 55;

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';

        // Enemy Movement
        this.step = 101;
        this.speed = speed;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.

        // Start Enemy Moving
        if(this.x < 505) {
            this.x += this.speed * dt;
        }

        // Reset Enemy to Start
        else {
            this.x = -101;
        }
}
    
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Hero {
    // Change Character to Selected
    selection(x) {
        switch(x){
            case 1:
                charChoice = 'images/char-boy.png';
                options.classList.toggle('hide');
                break;
            case 2:
                charChoice = 'images/char-cat-girl.png';
                options.classList.toggle('hide');
                break;
            case 3:
                charChoice = 'images/char-horn-girl.png';
                options.classList.toggle('hide');
                break;
            case 4:
                charChoice = 'images/char-pink-girl.png';
                options.classList.toggle('hide');
                break;
            case 5:
                charChoice = 'images/char-princess-girl.png';
                options.classList.toggle('hide');
        }
    }

    // Where to spawn character and what image to use
    constructor() {
        this.step = 101;
        this.jump = 83;
        this.x = this.step * 2;
        this.y = (this.jump * 4) + 55;
        this.sprite = charChoice;
        this.win = false;
    }

    // Draw Character on Screen
    render() {
        this.sprite = charChoice;
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Moving Character
    handleInput(input) {
        switch(input) {
            case 'left':
                if(this.x > 0) {
                    this.x -= this.step;
                }
                break;
            case 'right':
                if(this.x < this.step * 4) {
                    this.x += this.step;
                }
                break;
            case 'up':
                if(this.y > this.jump) {
                    this.y -= this.jump;
                }
                break;
            case 'down':
                if(this.y < this.jump * 4) {
                    this.y += this.jump;
                }
        }
    }

    // Check if Hit Enemies
    update() {
        // Check Each Enemy Position
        for(let enemy of allEnemies){
            // Check Character within Collision Range of Enemy
            if(this.y === enemy.y &&
                (enemy.x + enemy.step/2 > this.x && enemy.x < this.x + this.step/2)){
                // Reset Character if Collision
                this.reset();
                if(lives.childElementCount > 0){
                    lives.lastElementChild.remove();
                }
                
                else if(lives.childElementCount === 0 && stars.childElementCount === 3) {
                    stars.lastElementChild.remove(0);
                }
                
                else {
                    // Lose Screen
                    clearInterval(counting);
                    endGame();
                    lostPopup.classList.toggle('hide');
                }
            }
        }

        // Check if Player hit Gem
        for(let gem of allGems){
            if(this.x === gem.x && (this.y - gem.y < 20)
                && gem.sprite === 'images/Gem Blue.png'){
                gem.y -= 7;
                gem.sprite = 'images/Selector.png';
                stars.innerHTML += `<img src="images/Star.png">`;
            }
        }

        // Check if Player at River
        if(this.y === 55){
            this.win = true;
        }
    }

    // Reset Character Position if Collision
    reset() {
        this.x = this.step * 2;
        this.y = (this.jump * 4) + 55;
        min = [0, 101, 202, 303, 404];
        max = [130, 215, 300];
    }
}

class BlueGems {
    // Gem Location and Image
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/Gem Blue.png';
    }

    // Render Gem
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    reset(x) {
        this.x = random(min);
        this.y = random(max);
        this.sprite = 'images/Gem Blue.png';
    }
}

let startTimer = () => {
    seconds = 30, minutes = 1;
    counting = setInterval(function() {
        /* Add a 0 into Timer if Less Than 10 Seconds */
        if(seconds < 10) {
            timer.innerHTML = `Timer: ${minutes}:0${seconds}`;
        }
        else {
            timer.innerHTML = `Timer: ${minutes}:${seconds}`;
        }
        /* Decrease Seconds */
        seconds--;

        /* Decrease Minute if 0 Seconds */
        if(seconds == 0 && minutes == 1) {
            minutes--;
            seconds = 60;
        }

        /* End Timer if 0 Minutes & 0 Seconds */
        if(seconds == 0 && minutes == 0) {
            clearInterval(counting);
            timer.innerHTML = `Timer: 0:00`;
        }
        /* Wait 1 Second Before Repeating */
    }, 1000);
}

let winner = () => {
    // Update Timer and Win Screen
    timer.innerHTML = `Time: ${minutes}:${seconds}`;
    document.querySelector('.winnerTimer').innerHTML = `<h3>Time Left: ${minutes}:${seconds}</h3>`;
    document.querySelector('.winnerLives').innerHTML = `<h3>Lives Left:</h3><div>${lives.innerHTML}</div>`;
    document.querySelector('.winnerStars').innerHTML = `<h3>Skill Level:</h3><div>${stars.innerHTML}</div>`;
    // Set Time for Score
    if(minutes == 1) {
        minutes = 100
    } else {minutes = 0}
    // Set Lives and Stars for Score
    let livesScore = 1, starsScore = 1;
    if(lives.childElementCount > 0) {
        livesScore = lives.childElementCount;
    }
    if(stars.childElementCount > 0) {
        starsScore = stars.childElementCount;
    }
    // Calculate Score
    let x = (minutes + seconds) * (livesScore) * (starsScore);
    document.querySelector('.winnerScore').innerHTML = `<h3>Score: ${x}</h3>`;
}

let endGame = () => {
    // Update Timer and End Screen
    timer.innerHTML = `Time: ${minutes}:${seconds}`;
    document.querySelector('.lossTimer').innerHTML = `<h3>Time Left: ${minutes}:${seconds}</h3>`;
    document.querySelector('.lossLives').innerHTML = `<h3>Lives Left:</h3><div>${lives.innerHTML}</div>`;
    document.querySelector('.lossStars').innerHTML = `<h3>Skill Level:</h3><div>${stars.innerHTML}</div>`;
    // Set Time for Score
    if(minutes == 1) {
        minutes = 100
    } else {minutes = 0}
    // Set Lives and Stars for Score
    let livesScore = 1, starsScore = 1;
    if(lives.childElementCount > 0) {
        livesScore = lives.childElementCount;
    }
    if(stars.childElementCount > 0) {
        starsScore = stars.childElementCount;
    }
    // Calculate Score
    let x = (minutes + seconds) * (livesScore) * (starsScore);
    document.querySelector('.lossScore').innerHTML = `<h3>Score: ${x}</h3>`;
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Create Player Character
const player = new Hero();

// Create Enemy Characters
const bug1 = new Enemy(-101, 249, randomSpeed());
const bug2 = new Enemy(-101, 83, randomSpeed());
const bug3 = new Enemy(-250, 166, randomSpeed());
allEnemies.push(bug1, bug2, bug3);

// Create New Gems
const gem1 = new BlueGems(random(min), random(max));
const gem2 = new BlueGems(random(min), random(max));
const gem3 = new BlueGems(random(min), random(max));
// Array for Gems
const allGems = [];
allGems.push(gem1, gem2, gem3);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
