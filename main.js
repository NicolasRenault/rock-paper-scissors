const startButton = document.getElementById("game-button");
const gameObjects = document.getElementsByClassName("game-object");

let playing = false;
const gameSpeed = 50;
const numberOfObject = 75;

startButton.addEventListener("click", startButtonClick);
initGame();

/**
 * Init all the element of the page
 */
function initGame() {
    createObjects();
    setRandomPositionToGameObjects();
    startButton.disabled = false;
}

/**
 * Handle the click of the start button
 */
function startButtonClick() {
    playing = !playing;

    if (playing) {
        startButton.innerHTML = "Stop";
    } else {
        startButton.innerHTML = "Start";
    }

    play();
}

/**
 * Play or stop the game, depend of the playing boolean
 * 
 * @see playing
 * @returns void
 */
async function play() {
    if (playing) {
        moveAllGameObjects();
        handleCollision();
        handleWinner();
        setTimeout(play, gameSpeed);
    } else {
        return;
    }
}

/**
 * Create all the game object on the page
 */
function createObjects() {
    let gameContainer = document.getElementById("game-container");

    for (let i = 0; i < numberOfObject; i++) {
        ["rock", "paper", "scissors"].forEach((type) => {
        let obj = document.createElement("div");
        obj.classList.add("game-object", type);
        gameContainer.appendChild(obj);
        });
    }
}

/**
 * Move all the game object to a random location
 */
function setRandomPositionToGameObjects() {
    Array.prototype.forEach.call(gameObjects, (element) => {
        element.style.top = getRandomBetweenTwoNumber(0, 90) + "%";
        element.style.left = getRandomBetweenTwoNumber(0, 90) + "%";
    });
}

/**
 * Move sligtly all the game oject randomly in 2D
 */
async function moveAllGameObjects() {
    Array.prototype.forEach.call(gameObjects, (element) => {
        let top =
        element.style.top.replace("%", "") - getRandomBetweenTwoNumber(-2, 2);

        if (top > 95) {
        top = 95;
        } else if (top < 0) {
        top = 0;
        }

        element.style.top = top + "%";

        let left =
        element.style.left.replace("%", "") - getRandomBetweenTwoNumber(-2, 2);

        if (left > 95) {
        left = 95;
        } else if (left < 0) {
        left = 0;
        }

        element.style.left = left + "%";
    });
}

/**
 * Handle the collision of all the game object
 */
async function handleCollision() {
    Array.prototype.forEach.call(gameObjects, (i) => {
        Array.prototype.forEach.call(gameObjects, (j) => {
        if (isCollide(i, j)) {
            handleTypeWinner(i, j);
        }
        });
    });
}

/**
 * Handle the "rock < paper < scissors < rock" behavior
 * 
 * @param {HTMLElement} a 
 * @param {HTMLElement} b 
 */
function handleTypeWinner(a, b) {
    if (a.classList.contains("rock")) {
        if (b.classList.contains("paper")) {
        a.classList.remove("rock");
        a.classList.add("paper");
        } else if (b.classList.contains("scissors")) {
        b.classList.remove("scissors");
        b.classList.add("rock");
        }
    } else if (a.classList.contains("paper")) {
        if (b.classList.contains("rock")) {
        b.classList.remove("rock");
        b.classList.add("paper");
        } else if (b.classList.contains("scissors")) {
        a.classList.remove("paper");
        a.classList.add("scissors");
        }
    } else if (a.classList.contains("scissors")) {
        if (b.classList.contains("paper")) {
        b.classList.remove("paper");
        b.classList.add("scissors");
        } else if (b.classList.contains("rock")) {
        a.classList.remove("scissors");
        a.classList.add("rock");
        }
    }
}

/**
 * Check if there is only one type of game object left on the game to stop the game
 */
async function handleWinner() {
    let firstType = null;
    let findDifferentType = false;

    Array.prototype.forEach.call(gameObjects, (element) => {
        let currentType = Array.from(element.classList).filter((classes) => {
            return classes === "rock" || classes == "paper" || classes === "scissors";
        })[0];
        
        if (firstType === null) firstType = currentType;

        if (currentType !== firstType) {
            findDifferentType = true;
            return;
        }
    });

    if (!findDifferentType) {
        playing = false;
    }
}

/**
 * Get a random number between a range of two int
 * 
 * @param {int} min 
 * @param {int} max 
 * @returns int
 */
function getRandomBetweenTwoNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Check if two HTMLElement collide on the page
 * 
 * @param {HTMLElement} a 
 * @param {HTMLElement} b 
 * @returns boolean
 */
function isCollide(a, b) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        aRect.top + aRect.height < bRect.top ||
        aRect.top > bRect.top + bRect.height ||
        aRect.left + aRect.width < bRect.left ||
        aRect.left > bRect.left + bRect.width
    );
}
