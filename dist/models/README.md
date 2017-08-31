# Instruções para criação dos models

O model json é a representação dos campos da view, essa estrutura permite que sejam criadas views rapidamente bem como a rapida edição de campos sem ter que programar 1 linha se quer de código javascript/html

### Estrutura do arquivo

O nome do arquivo representa a rota que será acessada na url, exemplo:

```
/usuarios => usuarios.json
```

O conteúdo do arquivo é composto por um cabeçalho e um array de campos:

```
{
  "titulo": "Cadastro de Usuários",
  "titulo_modal": "Cadastro de usuário",
  "url": "usuarios",
  "chave": "id",
  "busca": {
    "ativo": true,
    "texto": "Procurar por usuário..."
  },
  "novo": {
    "ativo": true,
    "texto": "Novo",
    "objeto": {}
  },
  "abas": {
    "ativo": false,
    "lista": [
      {
        "id": 1,
        "texto": "Abertura"
      }
    ]
  },
  "campos": [
    {
      "campo": "id",
      "nome": "Código",
      "tipo": "text",
      "visivel": false,
      "requirido": true,
      "editavel": false,
      "listar": true
    }
  ]
}
```

### Campos do cabeçalho

Segue abaixo a relação de todos os campos possíveis no cabeçalho:

* titulo - O título que é exibido na tela da view, ao lado da pesquisa
* titulo_modal - O título que é exibido na tela da modal
* url - A url usada nas consultas a API
* chave - O campo chave da tabela
* busca - Objeto contendo informações relacionadas a barra de pesquisa
  - ativo - Exibe/Oculta a barra de busca
  - texto - Texto exibido dentro do campo da busca
* novo - objeto conteudo informações relacionadas ao botão novo registro
  - ativo - Exibe/Oculta o botão novo registro
  - texto - Texto exibido dentro do botão novo registro
  - objeto - Objeto que é carregado na modal ao clicar em novo registro
* abas - Objeto OPCIONAL para exibir abas na modal  
  - ativo - Se for true será exibidas as abas na modal
  - lista - Array de objetos contendo os ids e nomes das abas conforme exemplo acima
* campos - Array de objetos contendo as informações dos campos da tabela e da modal

### Campos da view

Segue abaixo a relação de todos os campos possíveis em cada objeto do array de campos.
OBS: alguns campos se aplicam apenas a um tipo específico de campo.

* campo - Nome do campo que será enviado para a API
* nome - Nome do campo que é exibido no label e na tabela
* tipo - Tipo de campo na modal (ver lista abaixo)
* visivel - Exibir/Ocultar campo na modal
* requirido - Se for true o campo será obrigatório e não será possivel salvar se preenche-lo
* editavel - Permite/Bloqueia o campo para edição na modal
* listar - Exibir/Ocultar campo na tabela
* linhas - Tamanho de linhas no tipo textarea
* verdadeiro - Array com valor e nome para exibição quando no tipo checkbox estiver selecionado
* falso - Array com valor e nome para exibição quando no tipo checkbox não estiver selecionado
* url - Url da API para carregar lista de registros no tipo select
* lista - Nome da variavel que vai receber a lista de registros no tipo select
* chave - Nome do campo chave do objeto
* descricao - Campo que deve ser exibido na tabela e no campo no tipo select
* aba - Número da aba ao qual o campo pertence (Somente se possuir o objeto abas configurado)
* arquivo - Nome da variavel que vai receber o objeto File lido no tipo file

### Lista de campos implementados

* text
* password
* email
* number
* textarea
* checkbox
* select
* file
