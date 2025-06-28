'use strict';

let validWordsList;
let validWordsListCurrWordIndex = 0;
let validWordsListCurrWordCharIndex = 0;
let wordsEnteredBuffer = [];
let currWordBuffer = '';
let currWordRemovedBuffer = '';
let typedTextBuffer = '';
let validWordCount = 0;
let currCharPos = 0;
let timerValueInSeconds = 0;
let wpm = 0;
let accuracy = 0;
const invalidKeys = {'Control': true, 'Shift': true, 'CapsLock': true, 'Tab': true, 'Escape': true, 'Alt': true, 'Enter': true, 'Meta': true, 'ContextMenu': true, 
			'ArrowUp': true, 'ArrowDown': true, 'ArrowLeft': true, 'ArrowRight': true, 'Delete': true, 'End': true, 'PageUp': true, 'PageDown': true, 
			'Insert': true, 'Home': true, 'Pause': true, 'ScrollLock': true, 'F1': true, 'F2': true, 'F3': true, 'F4': true, 'F5': true, 'F6': true,
			'F7': true, 'F8': true, 'F9': true, 'F10': true, 'F11': true, 'F12': true};

function secondsToTimeString(seconds) {
	let minutesStr = '';
	let secondsStr = '';
	const minutes = Math.floor(seconds / 60);
	seconds = seconds % 60;

	(minutes < 10) ? minutesStr = `0${minutes}` : minutesStr = `${minutes}`;
	(seconds < 10) ? secondsStr = `0${seconds}` : secondsStr = `${seconds}`;

	return `${minutesStr}:${secondsStr}`;
}

function isValidKey(key) {
	return invalidKeys[key] === undefined ? true : false;
}

function resetTypingTextAreaState() {
	validWordsList = [];
	validWordsListCurrWordIndex = 0;
	validWordsListCurrWordCharIndex = 0;
	wordsEnteredBuffer = [];
	currWordBuffer = '';
	currWordRemovedBuffer = '';
	typedTextBuffer = '';
	validWordCount = 0;
	currCharPos = 0;
	timerValueInSeconds = 0;
	wpm = 0;
	accuracy = 0;

	const typingTextArea = document.getElementById('typing-text-area');
	typingTextArea.innerHTML = '';
	initializeTypingTextArea();
}

function initializeTypingTextArea() {
	const typingTextArea = document.getElementById('typing-text-area');

	// The "words" array is loaded from another script.
	if (!words) {
		throw new Error(`"words" array expected but not found! Did "words.js" load correctly?`);
	}

	const randomIndex = Math.floor(Math.random() * words.length);
	const wordsSelection = words[randomIndex];
	if (wordsSelection) {
		validWordsList = wordsSelection.split(' ');
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
}

window.onload = () => {
	initializeTypingTextArea();

	const resetButton = document.getElementById('reset-button');
	resetButton.addEventListener('click', () => {
		resetTypingTextAreaState();
	});

	const infoBar = document.getElementById('timer');
	const timerValueUpdateIntervalId = setInterval(() => {
		timerValueInSeconds += 1;
		infoBar.innerHTML = secondsToTimeString(timerValueInSeconds);
	}, 1000);

	const wpmValue = document.getElementById('wpm-value');
	const wpmValueUpdateIntervalId = setInterval(() => {
		if (timerValueInSeconds > 0) {
			wpm = Math.floor(validWordCount / timerValueInSeconds * 60);
			wpmValue.innerHTML = wpm;
		} else {
			wpmValue.innerHTML = 0;
		}
	}, 300);

	const accuracyValue = document.getElementById('accuracy-value');
	const accuracyValueUpdateIntervalId = setInterval(() => {
		if (validWordsListCurrWordIndex > 0) {
			accuracy = (100 * (validWordCount / validWordsListCurrWordIndex)).toFixed(2);
			accuracyValue.innerHTML = `${accuracy} %`;
		} else {
			accuracyValue.innerHTML = '0.00 %';
		}
	}, 300);

	document.addEventListener('keydown', (e) => {
		e.preventDefault();
		const key = e.key;
		// Ignore keys designated as invalid.
		if (isValidKey(key)) {
			const characterSpan = document.querySelector(`[data-character-pos="${currCharPos}"]`);
			// Continue only if we have not reached the end of the typing text area.
			if (characterSpan) {
				if (key == ' ') {
					if (validWordsList[validWordsListCurrWordIndex ] === currWordBuffer) {
						validWordCount += 1;
					}
					wordsEnteredBuffer.push(currWordBuffer);
					currWordBuffer = '';
				}

				if (key == 'Backspace') {
					if (currCharPos > 0) {
						if (typedTextBuffer[typedTextBuffer.length - 1] === ' ') {
							currWordBuffer = wordsEnteredBuffer.pop();
							if (validWordsList[validWordsListCurrWordIndex - 1] === currWordBuffer) {
								validWordCount -= 1;
							}
							currWordRemovedBuffer = '';
						} else {
							currWordRemovedBuffer = currWordBuffer[currWordBuffer.length - 1] + currWordRemovedBuffer;
							currWordBuffer = currWordBuffer.slice(0,currWordBuffer.length - 1);
						}

						typedTextBuffer = typedTextBuffer.slice(0,typedTextBuffer.length - 1);

						if (validWordsListCurrWordCharIndex === 0) {
							validWordsListCurrWordIndex -= 1;
					        	validWordsListCurrWordCharIndex = validWordsList[validWordsListCurrWordIndex].length;
						} else {
							validWordsListCurrWordCharIndex -= 1;
						}

						const prevCharacterSpan = document.querySelector(`[data-character-pos="${currCharPos - 1}"]`);
						prevCharacterSpan.classList.remove('typed-correct');
						prevCharacterSpan.classList.remove('typed-incorrect');
						prevCharacterSpan.classList.add('typed-ready');
						currCharPos -= 1;
					}
				} else {
					if (key !== ' ') {
						currWordBuffer += key;
					}

					if (validWordsList[validWordsListCurrWordIndex].length === validWordsListCurrWordCharIndex) {
						validWordsListCurrWordIndex += 1;
						validWordsListCurrWordCharIndex = 0;
					} else {
						validWordsListCurrWordCharIndex += 1;
					}

					typedTextBuffer += key;

					// Update the state to reflect an incorrectly typed character.
					if (characterSpan.getAttribute('data-character') !== key) {
						characterSpan.classList.remove('typed-ready');
						characterSpan.classList.add('typed-incorrect');
					// Update the state to reflect a correctly typed character.
					} else {
						characterSpan.classList.remove('typed-ready');
						characterSpan.classList.add('typed-correct');
					}
					currCharPos += 1;
				}
	        	} else {
				// We have reached the end of the typing text area.
				// Stop the wpm counter.
				clearInterval(wpmValueUpdateIntervalId);
				// Stop the accuracy counter.
				clearInterval(accuracyValueUpdateIntervalId);
				// Stop the timer.
				clearInterval(timerValueUpdateIntervalId);
			}
		}
	});
};
