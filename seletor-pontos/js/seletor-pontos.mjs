export class SeletorPontos extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this._pontos;
		this._observador = new MutationObserver(() => this.pontos = this.dataset.pontos);
		this.init();
	}

	init() {
		this.observar(false);
		this.initDOM();
		this.initEvents();
		this.pontos = this.dataset.pontos;
		this.observar(true);
	}

	initDOM() {
		this.shadowRoot.innerHTML = this._template();
		this._divPrincipal = this.shadowRoot.querySelector('#div-principal');
		this._divPontosPrincipais = this.shadowRoot.querySelector('#div-pontos-principais');
		this._divPontosExtras = this.shadowRoot.querySelector('#div-pontos-extras');
		this._iptPontosExtras = this._divPontosExtras.querySelector('#pontos-extras');

		const name = this.getAttribute('name');
		const maxPontos = +this.dataset.maxPontos;
		const pontosPrincipaisDiv = this._divPontosPrincipais;
		for (let i = 1; i <= maxPontos; i++) {
			const checkbox = document.createElement('input');
			checkbox.setAttribute('type', 'checkbox');
			if (name) checkbox.setAttribute('name', name);
			checkbox.setAttribute('value', i);
			pontosPrincipaisDiv.append(checkbox);
		}
		
		if (!!this.dataset.maxPontosExtras) {
			this._divPontosExtras.querySelector('#remover-pontos-extras').addEventListener('click', () => {
				if (+this._iptPontosExtras.value)
					this.pontos--;
			});
				
			this._divPontosExtras.querySelector('#adicionar-pontos-extras').addEventListener('click', () => this.pontos++);
		} else {
			this._divPontosExtras.remove();
		}
	}

	initEvents() {
		this.shadowRoot.addEventListener("change", event => {
			let pontuacaoIncremento;

			if (!event.target.checked && event.target.value == this.pontos)
				pontuacaoIncremento = -1;
			else
				pontuacaoIncremento = event.target.value - this.pontos;

			this.pontos += pontuacaoIncremento;
		});
	}

	observar(sim = true) {
		if (sim)
			this._observador.observe(this, {attributes: true, attributeFilter: ['data-pontos']});
		else
			this._observador.disconnect();
	}

	atualizarBolinhas() {
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

	get pontos() {
		return +this._pontos;
	}

	set pontos(valor) {
		valor = (+valor || 0)

		if (valor == this._pontos)
			return;
		
		if (valor > (+this.dataset.maxPontos + +this.dataset.maxPontosExtras))
			return;

		eval(this.getAttribute('aomudarpontos'));
		
		if (!this.dispatchEvent(new CustomEvent('mudarpontos', {detail: {valorNovo: valor, valorAntigo: this._pontos}, bubbles: true, cancelable: true}))) {
			this.atualizarBolinhas();
			return;
		}
			
		this._pontos = valor;
		this.observar(false);
		this.setAttribute('data-pontos', this._pontos);
		this.observar(true);
		this.atualizarBolinhas();
	}

	_template() {
		return /* html */`
			<style>
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

			.fastFadeIn {
				opacity: 1;
				transition: opacity 0.5s;
			}

			.fadeIn {
				opacity: 1;
				transition: opacity 1s;
			}

			.slowFadeIn {
				opacity: 1;
				transition: opacity 3s;
			}

			.campo {
				margin: 0;
				padding-bottom: 1em;
				border: 1px solid #ccc;
				padding: .7em;
			}

			.campo-medio {
				display: inline-block;
				padding-right: .5em;
				width: 75%;
				height: 40px;
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

			.campo-redondo-medio {
				border-radius: 100%;
				border: var(--bolinha-borda, solid 1px #ccc);
				vertical-align: middle;
				text-align: center;
				font-weight: bold;
				font-size: 18px;
				width: 50px;
				height: 50px;
				outline: none;	
			}
		</style>
		<div id='div-principal'>
			<div id='div-pontos-principais'></div>
			<div id='div-pontos-extras' class='info-adicional'>
				<button id='remover-pontos-extras' class='botao remover-atributo'>-</button>
				<input id='pontos-extras' type='text' class='campo-redondo adicional' readonly=''/>
				<button id='adicionar-pontos-extras' class='botao adicionar-atributo'>+</button>
			</div>
		</div>
		`;
	}
}

customElements.define('seletor-pontos', SeletorPontos);