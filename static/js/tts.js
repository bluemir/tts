import * as $ from "../lib/bm.module.js";

const synth = window.speechSynthesis;

export async function simpleSpeak(text) {
	const {promise, resolve, reject} = new $.defer();

	if (synth.speaking) {
		reject(Error('speechSynthesis.speaking'));
		return;
	}
	if (text == '') {
		reject(Error("empty text"));
		return;
	}

	const utterance = new SpeechSynthesisUtterance(text);

	utterance.pitch = 1;
	utterance.rate = 1;

	utterance.on("end", () => {
		resolve();
	});
	utterance.on("error", () => {
		reject();
	});

	synth.speak(utterance);

	return await promise;
}

export function speak({text="", pitch=1, rate=1}={}) {
	console.log(`text: ${text}`)

	const start = new $.defer();
	const end = new $.defer();
	const reject = $.doAll(start.reject, end.reject);

	const utterance = new SpeechSynthesisUtterance(text);

	utterance.pitch = pitch;
	utterance.rate = rate;

	utterance.on("start", () => start.resolve())
	utterance.on("end", () => end.resolve())
	utterance.on("error", (e) => reject(e))

	synth.speak(utterance);

	return {
		start: start.promise,
		end: end.promise,
	};
}



/*
var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var voiceSelect = document.querySelector('select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var voices = [];

function populateVoiceList() {
	voices = synth.getVoices().sort(function (a, b) {
		const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
		if ( aname < bname ) return -1;
		else if ( aname == bname ) return 0;
		else return +1;
	});
	var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
	voiceSelect.innerHTML = '';
	for(i = 0; i < voices.length ; i++) {
		var option = document.createElement('option');
		option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

		if(voices[i].default) {
			option.textContent += ' -- DEFAULT';
		}

		option.setAttribute('data-lang', voices[i].lang);
		option.setAttribute('data-name', voices[i].name);
		voiceSelect.appendChild(option);
	}
	voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
	speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(){
	if (synth.speaking) {
		console.error('speechSynthesis.speaking');
		return;
	}
	if (inputTxt.value !== '') {
		var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
		utterThis.onend = function (event) {
			console.log('SpeechSynthesisUtterance.onend');
		}
		utterThis.onerror = function (event) {
			console.error('SpeechSynthesisUtterance.onerror');
		}
		var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
		for(i = 0; i < voices.length ; i++) {
			if(voices[i].name === selectedOption) {
				utterThis.voice = voices[i];
				break;
			}
		}
		utterThis.pitch = pitch.value;
		utterThis.rate = rate.value;
		synth.speak(utterThis);
	}
}

inputForm.onsubmit = function(event) {
	event.preventDefault();

	speak();

	inputTxt.blur();
}

pitch.onchange = function() {
	pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
	rateValue.textContent = rate.value;
}

voiceSelect.onchange = function(){
	speak();
}
*/
