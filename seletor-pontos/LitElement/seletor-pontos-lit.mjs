import {LitElement, html, css} from 'lit-element';
import {live} from 'lit-html/directives/live.js';

export class SeletorPontosLit extends LitElement {
	constructor() {
		super();
		this.pontos = 0;
		this.maxPontos = 0;
		this.maxPontosExtras = 0;
	}

	attributeChangedCallback(nome, valorAntigo, valorNovo) {
		console.log(nome, valorAntigo, valorNovo);
		super.attributeChangedCallback(nome, valorAntigo, valorNovo);
		
		if (valorNovo == valorAntigo) return;
		switch (nome) {
			case 'pontos':
				if (valorNovo != this.pontos) {
					this.pontos = valorNovo;
					if (this.pontos != valorNovo)
						this.setAttribute('pontos', this.pontos);
				}
			break;
		}
	}

	static get styles() {
		console.log('styles()');
		return css`input[type='checkbox'] {	
			width: 15px;
			height: 15px;
			background-color: var(--bolinha-desmarcada, white);
			border-radius: 50%;
			vertical-align: middle;
			border: var(--bolinha-borda, solid 1px #ccc);
			-webkit-appearance: none;
			outline: none;
			cursor: pointer;
			margin: var(--bolinha-margem, 8px 5px 0px 5px);
			transform: scale(1.5);
			transition: background-color 0.5s;
		}

		input[type='checkbox']:checked {
			background-color: var(--bolinha-marcada, rgb(8 143 98));
		}

		.botao {
			cursor: pointer;
			border: 2px solid;
			border-radius: 100%;
			width: 25px;
			height: 25px;
			outline: none;
		}

		.remover-atributo {
			background-color: rgb(161 65 36);
			border: var(--bolinha-borda, solid 1px #ccc);
		}

		.remover-atributo:active {
			border: var(--bolinha-borda, solid 1px #ccc);
		}

		.adicionar-atributo {
			background-color: rgb(41 133 175);
			border: var(--bolinha-borda, solid 1px #ccc);
		}

		.adicionar-atributo:active {
			border: var(--bolinha-borda, solid 1px #ccc);
		}

		.fade {
			transition: opacity 0.5s;
		}

		.campo-redondo {
			border-radius: 100%;
			border: var(--bolinha-borda, solid 1px #ccc);
			vertical-align: middle;
			text-align: center;
			font-size: 14px;
			font-weight: bold;
			width: 40px;
			height: 40px;	
		}`;
	}

	static get properties() {
		console.log('properties()');
		return {
			pontos: {type: Number, reflect: true},
			maxPontos: {type: Number, reflect: true},
			maxPontosExtras: {type: Number, reflect: true}
		}
	}
	
	connectedCallback() {
		console.log('connectedCallback');
		super.connectedCallback();
		this.shadowRoot.addEventListener('change', evento => {
			let pontuacaoIncremento;

			if (!evento.target.checked && evento.target.value == this.pontos)
				pontuacaoIncremento = -1;
			else
				pontuacaoIncremento = evento.target.value - this.pontos;

			this.pontos += pontuacaoIncremento;
		});
	}

	set pontos(valor) {
		console.log(`setPontos(${valor})`);
		valor = (+valor || 0);
		if ((valor == this.pontos) || (valor > (this.maxPontos + this.maxPontosExtras))) return;
		[this._pontos, valor] = [valor, this._pontos];
		this.requestUpdate('pontos', valor);
	}

	set maxPontos(valor) {
		console.log(`setMaxPontos(${valor})`);
		valor = (+valor || 0);
		[this._maxPontos, valor] = [valor, this._maxPontos];
		if (this.pontos > (this.maxPontos + this.maxPontosExtras))
			this.pontos = this.maxPontos + this.maxPontosExtras;
		this.requestUpdate('maxPontos', valor);
	}

	set maxPontosExtras(valor) {
		console.log(`setMaxPontosExtras(${valor})`);
		valor = (+valor || 0);
		[this._maxPontosExtras, valor] = [valor, this._maxPontosExtras];
		if (this.pontos > (this.maxPontos + this.maxPontosExtras))
			this.pontos = this.maxPontos + this.maxPontosExtras;
		this.requestUpdate('maxPontosExtras', valor);
	}

	get templatePontosExtras() {
		console.log('templatePontosExtras()');
		return html`<div style='opacity: ${(this.pontos >= this.maxPontos) ? 1 : 0}' class='info-adicional fade'>
			<button @click=${this.removerPonto} class='botao remover-atributo'>-</button>
			<input type='text' readonly .value=${`+${(this.pontos > this.maxPontos ? this.pontos - this.maxPontos : '0')}`} class='campo-redondo adicional'/>
			<button @click=${this.adicionarPonto} class='botao adicionar-atributo'>+</button>
		</div>`;
	}
	
	render() {
		console.log('render()');
		return html`<div>
			<div>
				${[...Array(this.maxPontos)].map((v, i) => html`<input type='checkbox' value='${i + 1}' .checked=${live((i + 1) <= this.pontos)} />`)}
			</div>
			${this.maxPontosExtras ? this.templatePontosExtras : ''}
		</div>`;
	}

	adicionarPonto(evento) {
		this.pontos++;
	}

	removerPonto(evento) {
		if (this.pontos > this.maxPontos)
			this.pontos--;
	}

	get pontos() {
		console.log('getPontos()');
		return +this._pontos;
	}

	get maxPontos() {
		console.log('getMaxPontos()');
		return +this._maxPontos;		
	}

	get maxPontosExtras() {
		console.log('getMaxPontosExtras()');
		return +this._maxPontosExtras;
	}

}

customElements.define('seletor-pontos-lit', SeletorPontosLit);