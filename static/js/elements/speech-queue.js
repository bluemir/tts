import * as $ from "../../lib/bm.module.js";
import {html, render} from "https://cdn.skypack.dev/lit-html@v2.1.2";

import { speak } from "../tts.js";

//import SpeechJob from "./speech-job.js";

export default class SpeechQueue extends $.CustomElement {
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
				ul {
					margin: 0px;
				}
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
		const dom = new SpeechQueueItem({
			text,
			onRedo: () => this.push({text}),
			onCancel: () => {
				this.q.remove(job);
				if (dom.attr("state") == "") {
					dom.attr("state", "canceled");
				}
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

class SpeechQueueItem extends $.CustomElement {
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
				@import "./static/css/common.css";

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
					<button @click=${() => elem.redo()}><i class="fa-solid fa-rotate-right"></i></button>
					<button @click=${() => elem.cancel()}><i class="fa-solid fa-xmark"></i></button>
				</section>
			</div>
		`;
	}
}
customElements.define("speech-queue-item", SpeechQueueItem);
