import * as $ from "../lib/bm.module.js";
import {html, render} from "https://cdn.skypack.dev/lit-html@v2.1.2";

import { speak } from "./tts.js"

class SpeechQueue extends $.CustomElement {
	constructor() {
		super();

		this.q = new $.AwaitQueue();

		this.runLoop();

		this.render();
	}
	onConnected() {
		this.render();
	}
	render() {
		render(this.constructor.template(this), this.shadow);
	}
	static get template() {
		return (elem) => html`
			<style>

			</style>
			<h2>Logs</h2>
			<ul></ul>
		`;
	}
	async runLoop() {
		for(let job of this.q) {
			await job();
		}
	}
	async push({text = ""}= {}) {
		const dom = new SpeechJob({
			text,
			onRedo: () => this.push({text}),
			onCancel: () => {
				this.q.remove(job);
				dom.attr("state", "canceled");
			},
		});
		$.get(this.shadow, "ul").append(dom);

		const job = async () => {
			const word = speak({text});

			await word.start;
			dom.attr("state", "progress");

			await word.end;
			dom.attr("state", "done");
		}
		this.q.add(job);
	}
}
customElements.define("speech-queue", SpeechQueue);

class SpeechJob extends $.CustomElement {
	constructor({text, onRedo, onCancel}) {
		super();

		this.attr("text", text);

		this.render();

		this.redo = onRedo;
		this.cancel = onCancel;
	}
	onConnected() {
		this.render();
	}
	render() {
		render(this.constructor.template(this), this.shadow);
	}
	static get template() {
		return (elem) => html`
			<style>
				:host {
					display: block;
				}
				:host([state=progress]) {
					background: yellow;
				}
				:host([state=done]) {
					background: green;
				}
				:host([state=canceled]) {
					background: red;
				}
				div {
					display: grid;
					grid-template-columns: 1fr auto;
				}
			</style>
			<div>
				<span>${elem.attr("text")}</span>
				<section>
					<button @click=${() => elem.redo()}>redo</button>
					<button @click=${() => elem.cancel()}>cancel</button>
				</section>
			</div>
		`;
	}
	/*
	redo() {
		console.log("redo");
	}
	cancel() {
		console.log("cancel");
	}
	*/
}
customElements.define("speech-job", SpeechJob);

$.get("form").on("submit", (evt) => {
	evt.preventDefault()

	const text = $.get("input").value;
	if (text == "") {
		return; //skip
	}

	$.get("speech-queue").push({text});

	$.get("input").value = "";
});
