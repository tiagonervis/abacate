//Controller principal carregado na index
app.controller("mainController", function($scope, $location, $http, $cookies) {

  //Exibe imagem carregando
  $scope.exibirCarregando = true;

  //Inicia contador de requisiscoes pendentes
  $scope.requisicoesPendentes = 0;

  //Inicia variavel da sessao atual
  $scope.sessao = {
    id: 0,
    nome: null,
    auth: null,
    logado: false
  };

  //Metodo chamado quando o carregamento da rota for iniciado
  $scope.$on('$routeChangeStart', function() {

    //Exibe imagem carregando
    $scope.exibirCarregando = true;

    //Se nao esta logado
    if (!$scope.sessao.logado) {

      //Se nao esta no login ou na solicitacao
      if ($location.path() !== '/login' && $location.path() !== '/solicitacao') {

        //Redireciona para login
        $location.path(rotas.login);
      }
    }
  });

  //Metodo chamado quando uma rota for carregada
  $scope.$on('$routeChangeSuccess', function() {

    //oculta imagem carregando
    $scope.exibirCarregando = false;
  });

  //Metodo generico para consultas a api
  $scope.api = function(url, metodo, dados, retorno, sucesso, erro, callback, parametros) {

    //Configura requisiscao
    var config = {
      url: configs.urlApi + url,
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'Autorization': 'Basic ' + $scope.sessao.auth
      }
    }

    //Incrementa requisicoes pendentes
    $scope.requisicoesPendentes++;

    //Executa a requisicao ajax
    $http(config).then(function(result) {

      //Decrementa requisicoes pendentes
      $scope.requisicoesPendentes--;

      //Retorna dados na variavel sucesso
      retorno[sucesso] = result.data;

      //Se callback foi informado
      if (callback !== undefined) {

        //Executa callback
        callback(parametros);
      }


    }, function(error) {

      //Decrementa requisicoes pendentes
      $scope.requisicoesPendentes--;

      //Se ocorreu erro na requisicao devolve codigo e descricao do erro
      retorno[erro] = error.status + ' ' + error.statusText;
    });
  };

  //Metodo para efetuar logout
  $scope.logout = function() {

    //Limpa objeto sessao
    $scope.sessao = {
      id: 0,
      nome: null,
      auth: null,
      logado: false
    };

    //Remove cookie sessao
    $cookies.remove('sessao');

    //Redireciona para login
    $location.path(rotas.login);
  };

});
