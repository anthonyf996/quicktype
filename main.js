'use strict';

let currCharPos = 0;

function initializeTypingTextArea() {
	const typingTextArea = document.getElementById('typing-text-area');

	if (!words) {
		throw new Error(`"words" array expected but not found! Did "words.js" load correctly?`);
	}

	const randomIndex = Math.floor(Math.random() * words.length);
	const wordsSelection = words[randomIndex];
	let charPos = 0;

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

	document.addEventListener('keydown', (e) => {
		const characterSpan = document.querySelector(`[data-character-pos="${currCharPos}"]`);
		if (characterSpan.getAttribute('data-character') !== e.key) {
			characterSpan.classList.remove('typed-ready');
			characterSpan.classList.add('typed-incorrect');
		} else {
			characterSpan.classList.remove('typed-ready');
			characterSpan.classList.add('typed-correct');
		}
		currCharPos += 1;
	});
};
