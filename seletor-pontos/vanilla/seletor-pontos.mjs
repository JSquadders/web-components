export class SeletorPontos extends HTMLElement {
	constructor() {
		super();
		this._pontos = 0;
		this._maxPontos = 0;
		this._maxPontosExtras = 0;
		this.attachShadow({mode: 'open'});
	}

	static get observedAttributes() {
		return ['data-pontos', 'data-max-pontos', 'data-max-pontos-extras']
	}

	attributeChangedCallback(nome, valorAntigo, valorNovo) {
		console.log(`attributeChanged(${nome}, ${valorAntigo}, ${valorNovo})`);
		if (valorNovo == valorAntigo) return;
		switch (nome) {
			case 'data-pontos':
				if (valorNovo != this.pontos) {
					this.pontos = valorNovo;
					if (this.pontos != valorNovo)
						this.dataset.pontos = this.pontos;
				}
			break;
			case 'data-max-pontos':
				if (valorNovo != this.maxPontos)
					this.maxPontos = valorNovo;
				this.render();
			break;
			case 'data-max-pontos-extras':
				if (valorNovo != this.maxPontosExtras)
					this.maxPontosExtras = valorNovo;
				this.render();
			break;
		}
	}
	
	set pontos(valor) {
		console.log(`setPontos(${valor})`);
		valor = (+valor || 0);
		if (this._pontos == valor) return;
		if (valor > (this.maxPontos + this.maxPontosExtras)) return;
		eval(this.getAttribute('aomudarpontos'));
		if (this.dispatchEvent(new CustomEvent('mudarpontos', {detail: {valorNovo: valor, valorAntigo: this._pontos}, bubbles: true, cancelable: true}))) {
			this._pontos = valor;
			if (this.dataset.pontos != valor)
				this.dataset.pontos = valor;
		}
		this.atualizarBolinhas();
	}

	set maxPontos(valor) {
		console.log(`setMaxPontos(${valor})`);
		this._maxPontos = (+valor || 0);
		if (this.dataset.maxPontos != this.maxPontos)
			this.dataset.maxPontos = this.maxPontos;
	}

	set maxPontosExtras(valor) {
		console.log(`setMaxPontosExtras(${valor})`);
		this._maxPontosExtras = (+valor || 0);
		if (this.dataset.maxPontosExtras != this.maxPontosExtras)
			this.dataset.maxPontosExtras = this.maxPontosExtras;
	}
	
	render() {
		console.log('render');
		if (!this.isConnected) return;

		this.shadowRoot.innerHTML = this.template;
		this._divPontosPrincipais = this.shadowRoot.querySelector('#div-pontos-principais');
		this._divPontosExtras = this.shadowRoot.querySelector('#div-pontos-extras');

		if (this._divPontosExtras) {
			this._iptPontosExtras = this._divPontosExtras.querySelector('#pontos-extras');

			this._divPontosExtras.querySelector('#remover-pontos-extras').addEventListener('click', () => {
				if (this.pontos > this.maxPontos)
					this.pontos--;
			});

			this._divPontosExtras.querySelector('#adicionar-pontos-extras').addEventListener('click', () => {
				if (this.pontos < (this.maxPontosExtras + this.maxPontos))
					this.pontos++;
			});
		}

		this.atualizarBolinhas();
	}

	atualizarBolinhas() {
		console.log('atualizarBolinhas');
		this._divPontosPrincipais.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = (+checkbox.value <= this.pontos));
		if (!!this._divPontosExtras) {
			if (this.pontos >= +this.maxPontos) {
				const pontosExtras = this.pontos - this.maxPontos;
				this._iptPontosExtras.value = '+' + ((pontosExtras > 0) ? pontosExtras : 0);
				this._divPontosExtras.classList.remove('fadeOut');
				this._divPontosExtras.classList.add('fadeIn');
			} else {
				this._divPontosExtras.classList.remove('fadeIn');
				this._divPontosExtras.classList.add('fadeOut');
			}
		}
	}
	
	get templateCheckboxes() {
		console.log('templateCheckboxes');
		const nome = (this.getAttribute('name') || '');

		let retorno = '';
		for (let i = 1; i <= this.maxPontos; i++)
			retorno += `<input type='checkbox' name='${nome}' value='${i}'/>`;
		
		return retorno;
	}

	get template() {
		console.log('template');
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
				background-color: var(--bolinha-marcada, rgb(8 143 98));
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

		let html = `<div id='div-principal'><div id='div-pontos-principais'>${this.templateCheckboxes}</div>`;
		
		if (!!this.maxPontosExtras) {
			html += /* html */ `<div id='div-pontos-extras' class='info-adicional'>
					<button id='remover-pontos-extras' class='botao remover-atributo'>-</button>
					<input id='pontos-extras' type='text' class='campo-redondo adicional' readonly/>
					<button id='adicionar-pontos-extras' class='botao adicionar-atributo'>+</button>
				</div>`;
			}
		html += '</div>';
		return estilo + html;
	}

	connectedCallback() {
		console.log('connectedCallback');
		this.shadowRoot.addEventListener('change', evento => {
			console.log('change');
			let pontuacaoIncremento;

			if (!evento.target.checked && evento.target.value == this.pontos)
				pontuacaoIncremento = -1;
			else
				pontuacaoIncremento = evento.target.value - this.pontos;

			this.pontos += pontuacaoIncremento;
		});
	}

	get pontos() {return +this._pontos}
	get maxPontos() {return +this._maxPontos}
	get maxPontosExtras() {return +this._maxPontosExtras}
}

customElements.define('seletor-pontos', SeletorPontos);