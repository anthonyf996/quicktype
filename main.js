'use strict';

let currCharPos = 0;
let timerValueInSeconds = 0;

function secondsToTimeString(seconds) {
	let minutesStr = '';
	let secondsStr = '';
	const minutes = Math.floor(seconds / 60);
	seconds = seconds % 60;

	(minutes < 10) ? minutesStr = `0${minutes}` : minutesStr = `${minutes}`;
	(seconds < 10) ? secondsStr = `0${seconds}` : secondsStr = `${seconds}`;

	return `${minutesStr}:${secondsStr}`;
}

function initializeTypingTextArea() {
	const typingTextArea = document.getElementById('typing-text-area');

	// The "words" array is loaded from another script.
	if (!words) {
		throw new Error(`"words" array expected but not found! Did "words.js" load correctly?`);
	}

	const randomIndex = Math.floor(Math.random() * words.length);
	const wordsSelection = words[randomIndex];
	let charPos = 0;
	// Attach state to each character of the selected words string from the "words" array.
	// Then, add and display each character to the typing text area on the webpage.
	wordsSelection.split('').forEach((character) => {
		const newCharacterSpan = document.createElement('span');
		newCharacterSpan.classList.add('typed-ready');
		newCharacterSpan.setAttribute('data-character', character);
		newCharacterSpan.setAttribute('data-character-pos', charPos);
		newCharacterSpan.innerHTML = character;
		typingTextArea.appendChild(newCharacterSpan);
		charPos += 1;
	});
}

window.onload = () => {
	initializeTypingTextArea();

	setInterval(() => {
		const infoBar = document.getElementById('timer');
		timerValueInSeconds += 1;
		infoBar.innerHTML = secondsToTimeString(timerValueInSeconds);
	}, 1000);

	document.addEventListener('keydown', (e) => {
		const characterSpan = document.querySelector(`[data-character-pos="${currCharPos}"]`);
		// Avoid moving the page down when the spacebar key is pressed.
		if (e.key == ' ') {
			e.preventDefault();
		}

		// Pressing the backspace key will undo state changes one character at a time.
		if (e.key == 'Backspace') {
			if (currCharPos > 0) {
				const prevCharacterSpan = document.querySelector(`[data-character-pos="${currCharPos - 1}"]`);
				prevCharacterSpan.classList.remove('typed-correct');
				prevCharacterSpan.classList.remove('typed-incorrect');
				prevCharacterSpan.classList.add('typed-ready');
				if (currCharPos > 0) {
					currCharPos -= 1;
				}
			}
		} else if (e.key !== 'Shift' ) {
			// Update the state to reflect an incorrectly typed character.
			if (characterSpan.getAttribute('data-character') !== e.key) {
				characterSpan.classList.remove('typed-ready');
				characterSpan.classList.add('typed-incorrect');
			// Update the state to reflect a correctly typed character.
			} else {
				characterSpan.classList.remove('typed-ready');
				characterSpan.classList.add('typed-correct');
			}
			currCharPos += 1;
		}
	});
};
