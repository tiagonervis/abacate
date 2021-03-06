//Controller principal carregado na index
app.controller("mainController", function($scope, $location, $http, $cookies, $timeout, $rootScope) {

  //Disponibiliza variavel com data atual
  $scope.hoje = new Date();

  //Exibe imagem carregando
  $scope.exibirCarregando = true;

  //Inicia contador de requisiscoes pendentes
  $scope.requisicoesPendentes = 0;

  //Objeto com o estado dos botoes responsivo
  $scope.botoes = {
    busca: false,
    novo: false
  };

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
    if (!$scope.sessao.logado && $cookies.get('auth') === undefined) {

      //Se nao esta no login ou na solicitacao
      if ($location.path() !== '/login' && $location.path() !== '/solicitacao') {

        //Redireciona para login
        $location.path(rotas.login);

        //oculta imagem carregando
        $scope.exibirCarregando = false;
      }
    }
  });

  //Metodo chamado quando uma rota for carregada
  $scope.$on('$routeChangeSuccess', function() {

    //oculta imagem carregando
    $scope.exibirCarregando = false;
  });

  //Metodo generico para consultas a api
  $scope.api = function(url, metodo, dados, retorno, sucesso, erro, callback, parametros, exibirErro = true) {

    //Configura requisiscao
    var config = {
      url: configs.urlApi + url,
      method: metodo,
      data: dados,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': $scope.sessao.auth
      }
    }

    //Incrementa requisicoes pendentes
    $scope.requisicoesPendentes++;

    //Executa a requisicao ajax
    $http(config).then(function(result) {

      //Decrementa requisicoes pendentes
      $scope.requisicoesPendentes--;

      //Se foi definido retorno e sucesso
      if (retorno !== undefined && sucesso !== undefined) {

        //Retorna dados na variavel sucesso
        retorno[sucesso] = result.data;
      }

      //Se callback foi informado
      if (callback !== undefined) {

        //Executa callback
        callback(parametros);
      }

    }, function(error) {

      //Decrementa requisicoes pendentes
      $scope.requisicoesPendentes--;

      //Se foi definido retorno e erro
      if (retorno !== undefined && erro !== undefined) {

        //Se ocorreu erro na requisicao devolve mensagem
        retorno[erro] = error.data.message;
      }

      //Se parametro exibir erro estiver setado
      if (exibirErro) {

        //Exibe notificacao do erro
        $scope.exibirNotificacao('Erro', retorno[erro], true, 5000);

        //Se nao estiver ativo executa o callback
      } else {

        //Se callback foi informado
        if (callback !== undefined) {

          //Executa callback
          callback(parametros);
        }
      }
    });
  };

  //Metodo para exibir uma notificacao na tela
  $scope.exibirNotificacao = function(titulo, mensagem, erro, tempo = 2000) {

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
    },tempo);
  };

  //Metodo para exibir uma janela de confirmacao
  $scope.exibirConfirmacao = function(mensagem, callback, param) {

    //Exibe confirmacao com os dados informados
    $scope.confirmacao = {
      ativo: true,
      mensagem: mensagem,
      confirmar: () => callback(param)
    };
  };

  //Metodo para efetuar login
  $scope.login = function (dados) {

    //Variavel local para receber retorno
    let retorno = {};

    //Inicia variavel com conteudo do cookie, se existir
    let basic = $cookies.get('auth');

    //Se login foi preenchido
    if (dados !== undefined) {

      //Compoe autenticacao tipo basic e converte em base64
      basic = btoa(dados.usuario + ':' + dados.senha);

      //Se foi marcado para salvar autenticacao
      if (dados.permanecerConectado) {

        //Define novo objeto date
        let expira = new Date();

        //Expira cookie daqui 30 dias
        expira.setDate($scope.hoje.getDate() + 30);

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

      //Decodifica dados da autenticacao
      let dados = atob(basic).split(':');

      //Compoe objeto para enviar na autenticacao
      dados = {
        usuario: dados[0],
        senha: dados[1]
      };

      //Chama metodo da api para autenticacao
      $scope.api('usuarios/autenticar', 'POST', dados, retorno, 'sucesso', 'erro', function () {

        //Se nao ocorreu erros
        if (retorno.erro === undefined) {

          //Obtem registro do usuario logado
          let usuario = retorno.sucesso;

          //Define id e nome do usuario recebido
          $scope.sessao.id = usuario.id;
          $scope.sessao.nome = usuario.nome;

          //Define sessao como logado
          $scope.sessao.logado = true;

          //Se esta na tela de login
          if ($location.path() === rotas.login) {

            //Redireciona para home
            $location.path(rotas.home);
          }

          //Se ocorreu erros
        } else {

          //Exibe notificacao do erro
          $scope.exibirNotificacao('Erro', "Usuário e/ou senha inválidos", true, 5000);

          //Forca logout
          $scope.logout();
        }
      }, null, false);
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

  //Metodo para recuperar senha
  $scope.recuperar = function (dados) {

    //Variavel local para receber retorno
    let retorno = {};

    //Verifica se senhas sao iguais
    if (dados.senha !== dados.repetir) {

      //Exibe notificacao do erro
      $scope.exibirNotificacao('Erro', "As senhas digitadas não são iguais, digite novamente", true, 5000);

      //Retorna
      return;
    }

    //Remove campo repetir
    delete dados.repetir;

    //Chama metodo da api para autenticacao
    $scope.api('usuarios/resetarSenha', 'PATCH', dados, retorno, 'sucesso', 'erro', function () {

      //Exibe notificacao do sucesso
      $scope.exibirNotificacao('Sucesso', "Senha atualizada com sucesso!");
    });
  };

  //Metodo para abrir modal com novo registro
  $scope.novo = function () {

    //Emite chamada para funcao em outro controller
    $rootScope.$emit("novo", {});
  };

  //Ao carregar controller tenta efetuar login
  $scope.login();

  //Monitora evento de scroll da pagina
  $(window).scroll(function() {

    //Se usuario nao esta logado
    if ($scope.sessao.id === 0) {

      //Retorna
      return;
    }

    //Se chegou no fim da pagina
    if($(window).scrollTop() + $(window).height() == $(document).height()) {

      //Emite chamada para funcao em outro controller
      $rootScope.$emit("mais", {});
    }
  });
});
