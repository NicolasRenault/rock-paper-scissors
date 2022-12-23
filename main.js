const button = document.getElementById("game-button");
const gameObjects = document.getElementsByClassName("game-object");

let playing = false;
const gameSpeed = 50;
const numberOfObject = 75;

button.addEventListener("click", buttonClick);
initGame();

function buttonClick() {
    playing = !playing;
    if (playing) {
        button.innerHTML = "Stop";
    } else {
        button.innerHTML = "Start";
    }

    play();
}

async function play() {
    if (playing) {
        moveAllGameObjects();
        handleTouch();
        handleWinner();
        setTimeout(play, gameSpeed);
    } else {
        return;
    }
}

function initGame() {
    createObjects();
    setRandomPositionToGameObjects();
    button.disabled = false;
}

function createObjects() {
    let gameContainer = document.getElementById("game-container");

    for (let i = 0; i < numberOfObject; i++) {
        // for (let j = 0; j < objectsType.length; j++) {
        //   const element = array[j];
        // }
        ["rock", "paper", "scissors"].forEach((type) => {
        let obj = document.createElement("div");
        obj.classList.add("game-object", type);
        gameContainer.appendChild(obj);
        });
    }
}

function setRandomPositionToGameObjects() {
    Array.prototype.forEach.call(gameObjects, (element) => {
        element.style.top = getRandomBetweenTwoNumber(0, 90) + "%";
        element.style.left = getRandomBetweenTwoNumber(0, 90) + "%";
    });
}

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

async function handleTouch() {
    Array.prototype.forEach.call(gameObjects, (i) => {
        Array.prototype.forEach.call(gameObjects, (j) => {
        if (isCollide(i, j)) {
            handleTypeWinner(i, j);
        }
        });
  });
}

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

async function handleWinner() {
    let lastType = null;
    let find = false;

    Array.prototype.forEach.call(gameObjects, (element) => {
        let currentType = Array.from(element.classList).filter((classes) => {
        return classes === "rock" || classes == "paper" || classes === "scissors";
        });

        if (lastType === null) lastType = currentType;

        if (currentType !== lastType) {
        //TODO Not working
        find = true;
        return;
        }
    });

    console.log(find);
    if (!find) {
        playing = false;
    }
}

function getRandomBetweenTwoNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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
