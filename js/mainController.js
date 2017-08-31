//Controller principal carregado na index
app.controller("mainController", function($scope, $location, $http, $cookies, $timeout) {

  //Disponibiliza variavel com data atual
  $scope.hoje = new Date();

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
      data: dados,
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
      retorno[erro] = error.statusText;

      //Exibe notificacao do erro
      $scope.exibirNotificacao('Erro', retorno.erro, true);
    });
  };

  //Metodo para exibir uma notificacao na tela
  $scope.exibirNotificacao = function(titulo, mensagem, erro) {

    //Exibe notificacao com os dados informados
    $scope.notificacao = {
      ativo: true,
      titulo: titulo,
      mensagem: mensagem,
      erro: erro
    };

    //Oculta notificacao apos tempo
    $timeout(function () {
      $scope.notificacao.ativo = false;
    },2000);
  };

  //Metodo para efetuar login
  $scope.login = function () {

    //Variavel local para receber retorno
    let retorno = {};

    //Inicia variavel com conteudo do cookie, se existir
    let basic = $cookies.get('auth');

    //Se login foi preenchido
    if ($scope.login !== undefined) {

      //Compoe autenticacao tipo basic e converte em base64
      basic = btoa($scope.login.usuario + ':' + $scope.login.senha);

      //Se foi marcado para salvar autenticacao
      if ($scope.login.permanecerConectado) {

        //Expira cookie daqui 30 dias
        let expira = new Date($scope.hoje + 30);

        //Grava cookie
        $cookies.put('auth', basic, { expires: expira });

      } else {

        //Remove cookie
        $cookies.remove('auth');
      }
    }

    //Se basic possui valor
    if (basic !== undefined) {

      //Define autenticacao no objeto sessao
      $scope.sessao.auth = basic;

      $scope.api('usuarios', 'GET', null, retorno, 'sucesso', 'erro', function () {

        $scope.sessao.logado = true;
        $location.path(rotas.home);
      });
    }
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

    //Remove cookie auth
    $cookies.remove('auth');

    //Redireciona para login
    $location.path(rotas.login);
  };

  //Ao carregar controller tenta efetuar login
  $scope.login();
});
