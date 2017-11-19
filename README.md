# Front-end do projeto Abacate

Instruções para geração do deploy:

1. Instalar o grunt e o mocha:

```
$ npm install grunt mocha -g
```

2. Instalar as dependencias:

```
$ npm install
```

3. Gerar deploy pelo grunt:

```
$ grunt
```

4. Executar testes na API:

```
$ mocha
```

No final do processo o servidor web incorporado estará rodando no endereço:

[127.0.0.1:3000](http://127.0.0.1:3000)

A pasta /dist criada contém todo o conteúdo necessário para o envio para FTP.
