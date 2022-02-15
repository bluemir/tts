import * as $ from "../../lib/bm.module.js";
import {html, render} from "https://cdn.skypack.dev/lit-html@v2.1.2";

export default class QuickBar extends $.CustomElement {
	constructor() {
		super();

		// test set
		// replace session store?
		this.data = [
			{text:"안녕하세요"},
			{text:"tts test 입니다"},
		];

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
				:host {
					display: block;
				}
			</style>
			<h2>Quick Bar</h2>
			<ul>
				${elem.data.map(item => html`
					<li><quick-bar-item text=${item.text}/></li>
				`)}
			</ul>
		`;
	}
}
customElements.define("quick-bar", QuickBar);

class QuickBarItem extends $.CustomElement {
	constructor() {
		super();

		this.render();
	}
	onConnected() {
		this.render();
	}
	render() {
		render(this.constructor.template(this), this.shadow);
	}
	onClick() {
		$.get("speech-queue").push({text: this.text});
	}
	get text() {
		return this.attr("text");
	}
	static get template() {
		return (elem) => html`
			<style>
				@import "./static/css/common.css";

				:host {
					display: block;
				}

				div {
					display: grid;
					grid-template-columns: 1fr auto;
				}
			</style>
			<div>
				<span>
					${elem.text}
				</span>
				<section>
					<button @click=${ evt => elem.onClick() }>
						<i class="fa-solid fa-rotate-right"></i>
					</button>
				</section>
			</div>
		`;
	}
}
customElements.define("quick-bar-item", QuickBarItem);
