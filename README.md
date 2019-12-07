Coleção de componentes reutilizáveis: web components, componentes de Vue e de JS puro.

## Testando módulos localmente
Para que sua página consiga importar módulos JS (`.mjs`) localmente é necessário ter um servidor web instalado e configurado corretamente para devolver arquivos com essa extensão. Eles precisam ser entregues pelo servidor web com um tipo MIME compatível com JavaScript para que o navegador aceite carregá-los.

Para realizar esse ajuste no Apache é preciso editar o arquivo `conf/mime.types`. Nele, busque por "application/javascript" ou outro tipo compatível com JavaScript, como `javascript/esm`) e acrescente a extensão `mjs`:

    application/javascript				js mjs
