import * as $ from "../lib/bm.module.js";
import {html, render} from "https://cdn.skypack.dev/lit-html@v2.1.2";

import "./elements/quick-bar.js";
import "./elements/speech-queue.js";

import { speak } from "./tts.js";

$.get("form").on("submit", (evt) => {
	evt.preventDefault()

	const text = $.get("input").value;
	if (text == "") {
		return; //skip
	}

	$.get("speech-queue").push({text});

	$.get("input").value = "";
});
