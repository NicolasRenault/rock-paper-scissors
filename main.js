import audioPop from "./public/audio/pop.flac";

const startButton = document.getElementById("game-button");
const gameObjects = document.getElementsByClassName("game-object");
const objectTitles = document.getElementsByClassName("object-title");
const numberOfObjectInput = document.getElementById("number-of-object");
const gameSpeedInput = document.getElementById("game-speed");
const movementSpeedInput = document.getElementById("movement-speed");
const playSoundInput = document.getElementById("play-sound");

const audio = new Audio(audioPop);
audio.volume = 0.2;

let playing = false;
let finished = false;

let numberOfObject = window.innerWidth > 768 ? 25 : 10;
let gameSpeed = 50;
let movementSpeed = 2;
let playSound = false;

startButton.addEventListener("click", startButtonClick);
numberOfObjectInput.addEventListener("change", changeGameConfigEvent);
gameSpeedInput.addEventListener("change", changeGameConfigEvent);
movementSpeedInput.addEventListener("change", changeGameConfigEvent);
playSoundInput.addEventListener("change", changeGameConfigEvent);

numberOfObjectInput.value = numberOfObject;
gameSpeedInput.value = gameSpeed;
movementSpeedInput.value = movementSpeed;
playSoundInput.checked = playSound;

initGame();

/**
 * Init all the element of the page
 */
function initGame() {
	playing = false;
	finished = false;
	createObjects();
	setRandomPositionToGameObjects();
	startButton.disabled = false;
	removeWinner();
}

/**
 * Reset the game by removing and re initing all the element of the page
 */
function resetGame() {
	startButton.disabled = true;
	removeAllObjects();
	initGame();
	removeWinner();
}

/**
 * Handle the click of the start button
 */
function startButtonClick() {
	playing = !playing;

	if (playing) {
		startButton.innerHTML = "Reset";
	} else {
		startButton.innerHTML = "Start";
		resetGame();
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
	if (playing && !finished) {
		moveAllGameObjects();
		handleCollision();
		handleWinner();
		setTimeout(play, gameSpeed);
	} else {
		return;
	}
}

/**
 * Remove all the game object from the page
 */
function removeAllObjects() {
	let gameContainer = document.getElementById("game-container");
	let noscript = document.getElementById("game-container-noscript");

	gameContainer.innerHTML = "";

	if (noscript !== null) gameContainer.appendChild(noscript);
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
		element.style.top = getRandomBetweenTwoNumber(0, 94) + "%";
		element.style.left = getRandomBetweenTwoNumber(0, 94) + "%";
	});
}

/**
 * Move sligtly all the game oject randomly in 2D
 */
async function moveAllGameObjects() {
	Array.prototype.forEach.call(gameObjects, (element) => {
		let top =
			element.style.top.replace("%", "") -
			getRandomBetweenTwoNumber(-movementSpeed, movementSpeed);

		if (top > 94) {
			top = 94;
		} else if (top < 0) {
			top = 0;
		}

		element.style.top = top + "%";

		let left =
			element.style.left.replace("%", "") -
			getRandomBetweenTwoNumber(-movementSpeed, movementSpeed);

		if (left > 94) {
			left = 94;
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
				let changed = handleTypeWinner(i, j);

				if (changed) {
					playPopSound();
				}
			}
		});
	});
}

/**
 * Handle the "rock < paper < scissors < rock" behavior
 * Return true if changed
 *
 * @param {HTMLElement} a
 * @param {HTMLElement} b
 * @returns boolean
 */
function handleTypeWinner(a, b) {
	let changed = false;

	if (a.classList.contains("rock")) {
		if (b.classList.contains("paper")) {
			a.classList.remove("rock");
			a.classList.add("paper");
			changed = true;
		} else if (b.classList.contains("scissors")) {
			b.classList.remove("scissors");
			b.classList.add("rock");
			changed = true;
		}
	} else if (a.classList.contains("paper")) {
		if (b.classList.contains("rock")) {
			b.classList.remove("rock");
			b.classList.add("paper");
			changed = true;
		} else if (b.classList.contains("scissors")) {
			a.classList.remove("paper");
			a.classList.add("scissors");
			changed = true;
		}
	} else if (a.classList.contains("scissors")) {
		if (b.classList.contains("paper")) {
			b.classList.remove("paper");
			b.classList.add("scissors");
			changed = true;
		} else if (b.classList.contains("rock")) {
			a.classList.remove("scissors");
			a.classList.add("rock");
			changed = true;
		}
	}

	return changed;
}

/**
 * Check if there is only one type of game object left on the game to stop the game
 */
async function handleWinner() {
	let firstType = null;
	let findDifferentType = false;

	Array.prototype.forEach.call(gameObjects, (element) => {
		let currentType = Array.from(element.classList).filter((classes) => {
			return (
				classes === "rock" ||
				classes == "paper" ||
				classes === "scissors"
			);
		})[0];

		if (firstType === null) firstType = currentType;

		if (currentType !== firstType) {
			findDifferentType = true;
			return;
		}
	});

	if (!findDifferentType) {
		finished = true;
		setWinner(firstType);
	}
}

/**
 * Play a pop sound
 */
function playPopSound() {
	if (playSound) audio.play(); // ? Is this really a good idea
}

/**
 * Set the value changed by the user into the config game
 *
 * @param {Event} event
 */
function changeGameConfigEvent(event) {
	changeGameConfig(event.target);
}

/**
 * Set the value changed by the user into the config game
 *
 * @param {HTMLElement} element
 */
function changeGameConfig(element) {
	if (element.type === "number") {
		if (Number(element.value) < Number(element.min)) {
			element.value = element.min;
			return;
		} else if (Number(element.value) > Number(element.max)) {
			element.value = element.max;
			return;
		}
	}

	switch (element.id) {
		case "number-of-object":
			numberOfObject = element.value;
			if (!playing || finished) resetGame();
			break;

		case "game-speed":
			gameSpeed = element.value;

			break;

		case "movement-speed":
			movementSpeed = element.value;
			break;

		case "play-sound":
			playSound = element.checked;
			break;

		default:
			break;
	}
}

/**
 * Init a visual animation for the winner and losers
 *
 * @param {String} winner
 */
function setWinner(winner) {
	Array.prototype.forEach.call(objectTitles, (element) => {
		if (element.classList.contains(winner)) {
			element.classList.add("winner");
		} else {
			element.classList.add("loser");
		}
	});
}

/**
 * Remove all the winner and loser class
 */
function removeWinner() {
	Array.prototype.forEach.call(objectTitles, (element) => {
		element.classList.remove("winner", "loser");
	});
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

/**
 * @author https://tailwindcomponents.com/component/number-input-counter
 */
function decrement(e) {
	const btn = e.target.parentNode.parentElement.querySelector(
		'button[data-action="decrement"]'
	);
	const target = btn.nextElementSibling;

	let value = Number(target.value);

	if (value > Number(target.min)) {
		value--;
		target.value = value;

		/**
		 * Custom: Call changeGameConfig method to update the game config from button actions
		 */
		changeGameConfig(target);
	}
}

/**
 * @author https://tailwindcomponents.com/component/number-input-counter
 */
function increment(e) {
	const btn = e.target.parentNode.parentElement.querySelector(
		'button[data-action="decrement"]'
	);
	const target = btn.nextElementSibling;

	let value = Number(target.value);

	if (value < Number(target.max)) {
		value++;
		target.value = value;

		/**
		 * Custom: Call changeGameConfig method to update the game config from button actions
		 */
		changeGameConfig(target);
	}
}

/**
 * @author https://tailwindcomponents.com/component/number-input-counter
 */
const decrementButtons = document.querySelectorAll(
	`button[data-action="decrement"]`
);

/**
 * @author https://tailwindcomponents.com/component/number-input-counter
 */
const incrementButtons = document.querySelectorAll(
	`button[data-action="increment"]`
);

/**
 * @author https://tailwindcomponents.com/component/number-input-counter
 */
decrementButtons.forEach((btn) => {
	btn.addEventListener("click", decrement);
});

/**
 * @author https://tailwindcomponents.com/component/number-input-counter
 */
incrementButtons.forEach((btn) => {
	btn.addEventListener("click", increment);
});
