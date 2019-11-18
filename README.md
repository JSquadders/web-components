# web-components
Coleção de componentes reutilizáveis.

Obs: nem todos são custom elements.

## Testando módulos localmente
Para que sua página consiga importar módulos JS (`.mjs`) localmente é necessário ter um servidor web instalado e configurado corretamente para entregar `mjs`. Motivo: o navegador bloqueia a importação de `mjs` que chegam sem o cabeçalho correto.

Para realizar esse ajuste no Apache é preciso editar o arquivo `conf/mime.types`. Nele, busque por "text/javascript", descomente a linha e preencha a extensão `mjs`:

    text/html					html htm
    text/javascript					mjs
