export class SeletorPontos extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.render();
	}

	connectedCallback() {
		console.log('connectedCallback');
		this.shadowRoot.addEventListener('change', event => {
			console.log('change');
			let pontuacaoIncremento;

			if (!event.target.checked && event.target.value == this.pontos)
				pontuacaoIncremento = -1;
			else
				pontuacaoIncremento = event.target.value - this.pontos;

			this.pontos += pontuacaoIncremento;
		});
	}

	static get observedAttributes() {
		return ['data-pontos', 'data-max-pontos'];
	}

	attributeChangedCallback(nome, valorAntigo, valorNovo) {
		console.log('attributeChanged', nome, valorAntigo, valorNovo);
		switch (nome) {
			case 'data-pontos':
				valorNovo = (+valorNovo || 0);
				if (valorAntigo == valorNovo) return;
				if (valorNovo > (+this.dataset.maxPontos + +this.dataset.maxPontosExtras)) {
					this.pontos = valorAntigo; // @todo dispara o callback outra vez. Processamento desnecessário
					return;
				}
		
				eval(this.getAttribute('aomudarpontos'));
				if (this.dispatchEvent(new CustomEvent('mudarpontos', {detail: {valorNovo: valorNovo, valorAntigo: valorAntigo}, bubbles: true, cancelable: true})))
					this.atualizarBolinhas();
			break;
			case 'data-max-pontos':
				if (valorAntigo == valorNovo) return;
				this.render();
			break;
		}
	}

	atualizarBolinhas() {
		console.log('atualizarBolinhas');
		this._divPontosPrincipais.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = (+checkbox.value <= this.pontos));
		if (!!this._divPontosExtras) {
			if (this.pontos >= +this.dataset.maxPontos) {
				const pontosExtras = this.pontos - this.dataset.maxPontos;
				this._iptPontosExtras.value = '+' + ((pontosExtras > 0) ? pontosExtras : 0);
				this._divPontosExtras.classList.remove('fadeOut');
				this._divPontosExtras.classList.add('fadeIn');
			} else {
				this._iptPontosExtras.value = '+0';
				this._divPontosExtras.classList.remove('fadeIn');
				this._divPontosExtras.classList.add('fadeOut');
			}
		}
	}
	
	_templateCheckboxes() {
		console.log('_templateCheckboxes', 'maxPontos', this);
		const nome = (this.getAttribute('name') || '');
		return [...Array(+this.dataset.maxPontos)].reduce((acumulador, atual, i) => {return acumulador += `<input type='checkbox' name='${nome}' value='${i + 1}'/>`}, '');
	}

	_template() {
		console.log('_template');
		const estilo = /* html */ `<style>
			input[type='checkbox'] {	
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
				background-color: var(--bolinha-marcada, rgb(8, 143, 98));
				transition: background-color 0.5s;
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
				background-color: rgb(161, 65, 36);
				border: var(--bolinha-borda, solid 1px #ccc);
			}

			.remover-atributo:active {
				border: var(--bolinha-borda, solid 1px #ccc);
			}

			.adicionar-atributo {
				background-color: rgb(41, 133, 175);
				border: var(--bolinha-borda, solid 1px #ccc);
			}

			.adicionar-atributo:active {
				border: var(--bolinha-borda, solid 1px #ccc);
			}

			.fadeOut {
				opacity: 0;
				transition: opacity 0.5s;
				pointer-events: none;
			}

			.fadeIn {
				opacity: 1;
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
			}
		</style>`;

		let html = `<div id='div-principal'><div id='div-pontos-principais'>${this._templateCheckboxes()}</div>`;
		
		if (!!this.dataset.maxPontosExtras) {
			html += /* html */ `<div id='div-pontos-extras' class='info-adicional'>
					<button id='remover-pontos-extras' class='botao remover-atributo'>-</button>
					<input id='pontos-extras' type='text' class='campo-redondo adicional' readonly/>
					<button id='adicionar-pontos-extras' class='botao adicionar-atributo'>+</button>
				</div>
			</div>`;
		}
		return estilo + html;
	}
	
	render() {
		console.log('render');
		this.shadowRoot.innerHTML = this._template();
		this._divPontosPrincipais = this.shadowRoot.querySelector('#div-pontos-principais')
		this._divPontosExtras = this.shadowRoot.querySelector('#div-pontos-extras');

		if (this._divPontosExtras) {
			this._iptPontosExtras = this._divPontosExtras.querySelector('#pontos-extras');
			this._divPontosExtras.querySelector('#remover-pontos-extras').addEventListener('click', () => {if (+this._iptPontosExtras.value) +this.pontos--});
			this._divPontosExtras.querySelector('#adicionar-pontos-extras').addEventListener('click', () => {if (this.pontos < (+this.dataset.maxPontosExtras + +this.dataset.maxPontos)) +this.pontos++});
		}

		this.atualizarBolinhas();
	}

	get pontos() {
		return +this.dataset.pontos;
	}

	set pontos(valor) {
		this.dataset.pontos = +valor;
	}
}

customElements.define('seletor-pontos', SeletorPontos);