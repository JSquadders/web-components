## Seletor de pontos `<seletor-pontos>`
Experimento de organização de código utilizando custom element e módulos JS.

Demo (sem módulos): https://codepen.io/Leokuma/pen/ZEEVLzE

###### Exemplo
```html
<seletor-pontos data-max-pontos='5' data-max-pontos-extras='5' data-pontos='0'></seletor-pontos>
```

--------------------
### Atributos
##### `data-max-pontos`
Número máximo de pontos permitido, ou seja, determina quantas bolinhas são exibidas.

##### `data-max-pontos-extras`
Máximo de pontos _extras_, que são exibidos além das bolinhas. O total de pontos permitido pelo elemento corresponde à soma deste atributo com o `data-max-pontos`.

##### `data-pontos`
Número de pontos atual.

-------
### CSS
As custom properties listadas abaixo podem ser usadas para customizar o estilo do componente.

##### `--bolinha-marcada`
Cor de fundo das bolinhas quando marcadas.

##### `--bolinha-desmarcada`
Cor de fundo das bolinhas quando desmarcadas.

##### `--bolinha-borda`
Propriedade `border` das bolinhas.  
Exemplo: `solid 1px blue`.

##### `--bolinha-margem`
Propriedade `margin` das bolinhas.  
Exemplo: `10px`.

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
