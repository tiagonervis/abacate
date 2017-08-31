//Controller generico pode ser usado em qualquer pagina
app.controller("genericController", function($scope, $routeParams, $http, $q) {

  //Metodo para carregar model
  $scope.iniciar = function () {

    //Exibe imagem carregando
    $scope.exibirCarregando = true;

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

      //Caso de erro
      } else {

        //Exibe notificacao de erro
        $scope.exibirNotificacao('Erro', 'Falha ao carregar model', true);
      }

      //oculta imagem carregando
      $scope.exibirCarregando = false;
    });
  };

  //Metodo para listar os registros
  $scope.listar = function () {

    //Chama api passando url do model e campo de pesquisa
    $scope.api($scope.model.url, 'GET', $scope.view.pesquisa, $scope.view, 'registros');
  };

  //Metodo para abrir modal de edicao
  $scope.editar = function (obj) {

    //Copia objeto informado para o objeto selecionado
    angular.copy(obj, $scope.view.selecionado);

    //Exibe modal
    $('.modal').modal();
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
    }

    //Chama api passando url atual, metodo atual, e o objeto selecionado
    $scope.api($scope.model.url, metodo, $scope.view.selecionado, retorno, 'sucesso', 'erro', function () {

      //Caso consiga salvar exibe notificacao de sucesso
      $scope.exibirNotificacao('Sucesso', 'Registro salvo com sucesso!', false);

      //Fecha a modal
      $('.modal').modal('toggle');

      //Atualiza lista de registros
      $scope.listar();
    });
  };

  //Metodo para excluir um registro
  $scope.excluir = function (id) {

    //Exibe mensagem de confirmacao
    if (confirm("Confirmar exclusão do registro?")) {

      //Variavel local para receber o retorno da api
      let retorno = {};

      //Executa chamada da api para excluir o registro informado
      $scope.api($scope.model.url + '/' + id, 'DELETE', null, retorno, 'sucesso', 'erro', function () {

        //Caso consiga excluir exibe notificacao de sucesso
        $scope.exibirNotificacao('Sucesso', 'Registro excluído com sucesso!', false);

        //Atualiza lista de registros
        $scope.listar();
      });
    }
  };
});
