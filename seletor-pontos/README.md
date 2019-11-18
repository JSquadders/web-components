## Seletor de pontos `<seletor-pontos>`
Experimento de organização de código utilizando custom element e módulos JS.

Demo (sem módulos): https://codepen.io/Leokuma/pen/ZEEVLzE

###### Exemplo
```html
<seletor-pontos data-max-pontos='5' data-max-pontos-extras='5' data-pontos='0' style='display: flex'
	data-css=
		'input[type="checkbox"]:checked {
			background-color: rgb(20, 150, 210);
		}
		#div-pontos-extras {
			padding-left: 10px;
		}'
></seletor-pontos>
```

--------------------
### Atributos
##### `data-max-pontos`
Número máximo de pontos permitido, ou seja, determina quantas bolinhas são exibidas.

##### `data-max-pontos-extras`
Máximo de pontos _extras_, que são exibidos além das bolinhas. O total de pontos permitido pelo elemento corresponde à soma deste atributo com o `data-max-pontos`.

##### `data-pontos`
Número de pontos atual.

##### `style`
Os estilos introduzidos nesse atributo são aplicados à `<div>` que agrupa o elemento como um todo.

##### `data-css`
Permite introduzir estilos como numa tag `<style>`, utilizando seletores. Esses estilos podem sobrescrever o estilo padrão do componente. Utilize, por exemplo, os seletores `#div-pontos-principal` e `#div-pontos-extras` para selecionar as `<div>` das bolinhas e dos pontos extras respectivamente.

##### `data-stylesheet`
Recebe o caminho para uma folha de estilos externa. Caso ocorra FOUC, utilize os métodos inline de estilização mencionados acima.

Útil para aplicar um mesmo estilo a diversos `<seletor-pontos>`. Mesmo estando marcada em vários `<seletor-pontos>`, a folha de estilos é baixada uma única vez e cacheada pelo navegador.

-----------------
### Eventos
##### `aomudarpontos`
É disparado sempre que a pontuação for alterada, seja via checkbox ou diretamente no atributo `data-pontos`.

Em `evento.detail.valorAntigo` e `evento.detail.valorNovo` pode-se obter os valores de antes e depois da alteração de pontos.

Chamar `event.preventDefault()` dentro do evento o cancela.
###### Exemplo
```html
<seletor-pontos id='seletor' data-max-pontos="5"></seletor-pontos>
<script>
document.querySelector('#seletor').addEventListener('mudarpontos', evento => {
	console.log('Valor antigo: ' + evento.detail.valorAntigo);
	console.log('Valor novo: ' + evento.detail.valorNovo);
	evento.preventDefault(); // cancela alteração de pontos
});
</script>
```
