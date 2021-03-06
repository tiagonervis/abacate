//Controller generico pode ser usado em qualquer pagina
app.controller("genericController", function($scope, $routeParams, $http, $q, $location, $rootScope) {

  //Inicia variavel de controle
  $scope.carregado = false;

  //Inicia na pagina 0
  $scope.paginaAtual = 0;

  //Inicia sem ordenacao
  $scope.ordenacao = {
    campo: null,
    ordem: false
  };

  //Metodo para carregar model
  $scope.iniciar = function () {

    //Incrementa requisicoes pendentes
    $scope.requisicoesPendentes++;

    //Define o nome do arquivo pela url
    let arquivo = 'models/' + $routeParams.rota + '.json';

    //Obtem o arquivo json
    $http.get(arquivo).then(function (result) {

      //Se resultado for um objeto
      if (typeof(result.data) === 'object') {

        //Inicia objeto no escopo com o nome de model
        $scope.model = result.data;

        //Inicia um objeto que contera dados da view atual
        $scope.view = {
          registros: [],
          selecionado: {},
          pesquisa: ''
        };

        //Metodo para listar registros
        $scope.listar();

        //Decrementa requisicoes pendentes
        $scope.requisicoesPendentes--;

        //Exibe conteudo da view
        $scope.carregado = true;

        //Define o titulo do model no objeto global
        $scope.botoes.titulo = $scope.model.titulo;

        //Oculta botao de novo
        $scope.botoes.novo = false;

        //Se model tem configuracao de novo registro
        if ($scope.model.novo.ativo) {

          //Exibe botao novo
          $scope.botoes.novo = true;

          //Registra chamada global por novo registro
          $rootScope.$on("novo", function() {

            //Se recebeu uma chamada exibe modal com novo objeto
            $scope.editar($scope.model.novo.objeto);
          });
        }

        //Registra chamada global para consultar mais
        $rootScope.$on("mais", function() {

          //Se nao tem consultas pendentes
          if ($scope.requisicoesPendentes === 0) {

            //Se possui a quantidade limite de registros
            if ($scope.view.registros.length === (($scope.paginaAtual + 1) * configs.limiteRegistros)) {

              //Incrementa pagina
              $scope.paginaAtual++;

              //Atualiza lista de registros
              $scope.listar();
            }
          }
        });

        //Se filtro esta ativo
        if ($scope.model.filtros !== undefined && $scope.model.filtros.ativo) {

          //Inicia array de filtros na view
          $scope.view.filtros = [];

          //Percorre todos os campos do model
          for (var i in $scope.model.campos) {

            //Variavel para campo atual
            var atual = $scope.model.campos[i];

            if (atual.tipo === 'select' || atual.tipo === 'checkbox') {

              //Cria objeto local
              var obj = {};

              //Define campo nao incluido
              obj.incluir = false;

              //Copia campo do model
              obj.campo = angular.copy(atual, obj.campo);

              //Insere objeto no array de filtros
              $scope.view.filtros.push(obj);
            }
          }
        }

        //Caso de erro
      } else {

        //Exibe notificacao de erro
        $scope.exibirNotificacao('Erro', 'Falha ao carregar model', true, 5000);

        //Decrementa requisicoes pendentes
        $scope.requisicoesPendentes--;
      }

      //Metodo em caso de erro
    }, function (error) {

      //Exibe notificacao de erro
      $scope.exibirNotificacao('Erro', 'Falha ao carregar model', true, 5000);

      //Decrementa requisicoes pendentes
      $scope.requisicoesPendentes--;
    });
  };

  //Metodo para listar os registros
  $scope.listar = function () {

    //Cria novo objeto
    let obj = {};

    //Se o campo de busca for um objeto
    if (typeof($scope.model.busca.campo) === 'object') {

      //Converte objeto em string
      let json = JSON.stringify($scope.model.busca.campo);

      //Substitui palavra busca pelo conteudo da pesquisa e converte em objeto
      obj = JSON.parse(json.replace('busca', $scope.view.pesquisa));

    } else {

      //Define campo do objeto e valor
      obj[$scope.model.busca.campo] = $scope.view.pesquisa;
    }

    //Compoe url para consulta
    let url = $scope.model.url + '/pesquisar?';

    //Insere numero da pagina e quatidade de registros
    url += 'pagina=' + $scope.paginaAtual + '&quantidade=' + configs.limiteRegistros;

    //Se foi definido um campo para ordenacao
    if ($scope.ordenacao.campo !== null) {

      //Cria variavel para ordem
      let ordem = $scope.ordenacao.ordem ? 'asc' : 'desc';

      //Insere campo ordenado e ordem na url
      url += '&atributoOrdenado=' + $scope.ordenacao.campo + '&ordem=' + ordem;
    }

    //Se filtro esta ativo
    if ($scope.model.filtros !== undefined && $scope.model.filtros.ativo) {

      //Percorre filtros
      for (var i in $scope.view.filtros) {

        //Define filtro atual
        let filtro = $scope.view.filtros[i];

        //Se deve usar esse filtro
        if (filtro.filtrar) {

          //Insere filtro no objeto de pesquisa
          obj[filtro.campo.campo] = filtro.valor;
        }
      }

      //Fecha modal de filtros
      $('#modal-filtros').modal('hide');
    }

    //Chama api passando url do model e campo de pesquisa
    $scope.api(url, 'POST', obj, $scope, 'registros', 'erros', function() {

      //Se a pagina for maior que 0
      if ($scope.paginaAtual > 0) {

        //Concatena registros recebidos com os atuais
        $scope.view.registros = $scope.view.registros.concat($scope.registros);

      } else {

        //Se for a primeira pagina sobreescreve array
        $scope.view.registros = $scope.registros;
      }
    });
  };

  //Metodo para abrir modal de edicao
  $scope.editar = function (obj) {

    //Copia objeto informado para o objeto selecionado
    angular.copy(obj, $scope.view.selecionado);

    //Se for um registro ja existente
    if ($scope.view.selecionado[$scope.model.chave] !== undefined) {

      //Percorre lista de campos
      for (var i in $scope.model.campos) {

        //Variavel local para o campo
        let atual = $scope.model.campos[i];

        //Se tem um campo tipo image
        if (atual.tipo === 'image') {

          //Compoe url para consulta
          let url = $scope.model.url + '/' + $scope.view.selecionado[$scope.model.chave];

          //Consulta o item via get para obter imagens
          $scope.api(url, 'GET', null, $scope.view, 'selecionado', null, function () {

            //Variavel para campo atual
            let campo = $scope.view.selecionado[atual.campo];

            //Se o campo nao for nulo
            if (campo !== null) {

              //Sobreescreve campo removendo parte do conteudo que nao faz parte da imagem
              $scope.view.selecionado[atual.campo] = campo.replace('/app/','');
            }
          });
        }

        //Se tem um campo tipo table
        if ($scope.model.campos[i].tipo === 'table') {

          //Define variavel para campo atual
          let atual = $scope.model.campos[i];

          //Compoe url para consulta
          let url = atual.url + '/' + $scope.view.selecionado[atual.parametro];

          //Executa consulta para receber dados do campo
          $scope.api(url, 'GET', null, $scope.view.selecionado, atual.campo);
        }

        //Se tem um campo tipo date ou datetime
        if ($scope.model.campos[i].tipo === 'date' || $scope.model.campos[i].tipo === 'datetime') {

          //Define variavel para campo atual
          let atual = $scope.model.campos[i];

          //Variavel para campo atual
          let campo = $scope.view.selecionado[atual.campo];

          //Se o campo nao for nulo
          if (campo !== null) {

            //Converte data no formato javascript
            $scope.view.selecionado[atual.campo] = campo + 'Z';

            //Se for tipo datetime
            if ($scope.model.campos[i].tipo === 'datetime') {

              //Separa campo da hora
              $scope.view.selecionado[atual.campo+'-hora'] = campo.split('T')[1].split('.')[0];
            }
          }
        }
      }

    //Se for um novo registro
    } else {

      //Percorre lista de campos
      for (var i in $scope.model.campos) {

        //Variavel local para o campo
        let atual = $scope.model.campos[i];

        //Se for um campo tipo date
        if ((atual.tipo === 'datetime' || atual.tipo === "date") && atual.iniciar) {

          //Obtem data e hora atual
          let agora = new Date();

          //Obtem a data e hora descontando diferenca do fuso horario
          agora = new Date(agora.getTime() - agora.getTimezoneOffset() * 60 * 1000);

          //Define data no campo
          $scope.view.selecionado[atual.campo] = agora.toISOString();

          //Se for tipo datetime
          if (atual.tipo === 'datetime') {

            //Variavel para campo atual
            let campo = $scope.view.selecionado[atual.campo];

            //Separa campo da hora
            $scope.view.selecionado[atual.campo+'-hora'] = campo.split('T')[1].split('.')[0];
          }
        }
      }
    }

    //Exibe modal
    $('#modal-editar').modal();
  };

  //Metodo para salvar o objeto atual selecionado
  $scope.salvar = function () {

    //Variavel local para receber o retorno da api
    let retorno = {};

    //Metodo padrao 'editar'
    let metodo = 'PATCH';

    //Se objeto nao tem o campo chave
    if ($scope.view.selecionado[$scope.model.chave] === undefined) {

      //Metodo 'novo'
      metodo = 'POST';

    } else {

      //Percorre lista de campos
      for (var i in $scope.model.campos) {

        //Se tem um campo tipo table
        if ($scope.model.campos[i].tipo === 'table') {

          //Define variavel para campo atual
          let atual = $scope.model.campos[i];

          //Compoe url para consulta
          let url = atual.url + '/' + $scope.view.selecionado[atual.parametro];

          //Executa consulta para receber dados do campo
          $scope.api(url, 'POST', $scope.view.selecionado[atual.campo]);
        }
      }
    }

    //Percorre lista de campos
    for (var i in $scope.model.campos) {

      //Se tem um campo tipo date ou datetime
      if ($scope.model.campos[i].tipo === 'date' || $scope.model.campos[i].tipo === 'datetime') {

        //Define variavel para campo atual
        let atual = $scope.model.campos[i];

        //Variavel para campo atual
        let campo = $scope.view.selecionado[atual.campo];

        //Se o campo nao for nulo
        if (campo !== undefined && campo !== null) {

          //Se o campo for um tipo Date
          if (typeof(campo) === 'object') {

            //Obtem data em formato iso
            campo = campo.toISOString();
          }

          //Remove Z da data
          $scope.view.selecionado[atual.campo] = campo.replace('Z','');

          //Se for tipo datetime
          if ($scope.model.campos[i].tipo === 'datetime') {

            //Define variavel para campo hora
            let hora = $scope.view.selecionado[atual.campo+'-hora'];

            //Insere hora na data formatada
            $scope.view.selecionado[atual.campo] = campo.split('T')[0] + 'T' + hora + '.001';
          }
        }
      }
    }

    //Chama api passando url atual, metodo atual, e o objeto selecionado
    $scope.api($scope.model.url, metodo, $scope.view.selecionado, retorno, 'sucesso', 'erro', function () {

      //Caso consiga salvar exibe notificacao de sucesso
      $scope.exibirNotificacao('Sucesso', 'Registro salvo com sucesso!', false);

      //Fecha a modal
      $('#modal-editar').modal('toggle');

      //Atualiza lista de registros
      $scope.listar();
    });
  };

  //Metodo para excluir um registro
  $scope.excluir = function (id) {

    //Exibe mensagem de confirmacao
    $scope.exibirConfirmacao("Confirmar exclusão do registro?", function () {

      //Variavel local para receber o retorno da api
      let retorno = {};

      //Executa chamada da api para excluir o registro informado
      $scope.api($scope.model.url + '/' + id, 'DELETE', null, retorno, 'sucesso', 'erro', function () {

        //Caso consiga excluir exibe notificacao de sucesso
        $scope.exibirNotificacao('Sucesso', 'Registro excluído com sucesso!', false);

        //Atualiza lista de registros
        $scope.listar();
      });
    });
  };

  //Metodo para ordenar resultados pelo campo informado
  $scope.ordenar = function (campo) {

    //Se a ordenacao ja esta definida neste campo
    if ($scope.ordenacao.campo === campo) {

      //Inverte ordem definida
      $scope.ordenacao.ordem = !$scope.ordenacao.ordem;
    }

    //Define novo campo de ordenacao
    $scope.ordenacao.campo = campo;

    //Reinicia offset da pagina
    $scope.paginaAtual = 0;

    //Atualiza lista de registros
    $scope.listar();
  };

  //Metodo para obter a descricao de varios campos de um objeto
  $scope.descricao = function(item, atual) {

    //Se descricao for de mais de um campo
    if (typeof(atual.descricao) === 'object') {

      //Inicia variavel para armazenar descricao final
      var descricao = "";

      //Percorre array de campos
      for (var i in atual.descricao) {

        //Separa os campos que sao dos filhos
        var campos = atual.descricao[i].split('.');

        //Variavel para armazenar expressao
        var expressao = "";

        //Percorre campos
        for (var c in campos) {

          //Monta expressao
          expressao += "['" + campos[c] + "']";
        }

        //Obtem a descricao atraves da epressao montada
        descricao += eval("item" + expressao);

        //Verifica se deve inserir o separador
        if (i < atual.descricao.length-1) {

          //Insere separador na descricao
          descricao += atual.separador;
        }
      }

      //Retorna descricao final
      return descricao;
    }

    //Se for apenas um campo retorna campo informado na descricao
    return item[atual.descricao];
  };

  //Metodo para abrir modal para imprimir relatorio
  $scope.imprimir = function () {

    //Inicia novo objeto relatorio
    $scope.view.relatorio = {
      titulo: $scope.model.imprimir.titulo,
      ordenar: $scope.model.chave,
      ordem: 'asc',
      limite: 0,
      campos: []
    };

    //Percorre todos os campos do model
    for (var i in $scope.model.campos) {

      //Variavel para campo atual
      var atual = $scope.model.campos[i];

      //Cria objeto local
      var obj = {};

      //Define campo como incluido
      obj.incluir = true;

      //Define nome visivel
      obj.nome = atual.nome;

      //Define nome do campo
      obj.campo = atual.campo;

      //Se o campo for um tipo select
      if (atual.tipo === 'select') {

        //Define nome do campo e nome do atributo a exibir
        obj.campo = atual.campo + '.' +  atual.descricao;

        //Se decricao for um array
        if (typeof(atual.descricao) === 'object') {

          //Define nome do campo e nome do atributo a exibir do primeiro campo
          obj.campo = atual.campo + '.' +  atual.descricao[0];
        }
      }

      //Insere objeto no array de campos
      $scope.view.relatorio.campos.push(obj);
    }

    //Exibe modal imprimir
    $('#modal-imprimir').modal();
  };

  //Metodo para montar url de impressao do relatorio
  $scope.imprimirOK = function () {

    //Variavel local para objeto relatorio
    var relatorio = $scope.view.relatorio;

    //Inicia array de titulos
    var titulos = [];

    //Inicia array de atribuitos
    var atributos = [];

    //Percorre campos do relatorio
    for (var i in relatorio.campos) {

      //Variavel para campo atual
      var atual = relatorio.campos[i];

      //Se campo deve ser incluido no relatorio
      if (atual.incluir) {

        //Insere nome nos titulos
        titulos.push(atual.nome);

        //Insere campo nos atributos
        atributos.push(atual.campo);
      }
    }

    //Objeto para envio
    var obj = {};
    obj.authorization = $scope.sessao.auth;
    obj.nomeRelatorio = relatorio.titulo;
    obj.entidadeDeExemplo = {tabela: atual.tabela};
    obj.titulos = titulos;
    obj.atributos = atributos;
    obj.atributoOrdenado = relatorio.ordenar;
    obj.ordem = relatorio.ordem;

    //Se o limite for maior que 0
    if (relatorio.limite > 0) {

      //Define como primeira pagina
      obj.pagina = 0;

      //Insere quantidade no objeto
      obj.quantidade = relatorio.limite;
    }

    //Compoe url da consulta a api
    var url = configs.urlApi + 'pdf?';

    //Insere entidade na consulta
    url += 'entidade=' + $scope.model.imprimir.entidade;

    //Converte em URI e insere objeto em base64 na consulta
    url += '&obj=' + btoa(encodeURI(JSON.stringify(obj)));

    //Abre nova aba com a url montada
    window.open(url, '_blank');
  };
});
