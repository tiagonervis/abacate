//Declaracao da aplicacao
var app = angular.module("app", ['ngRoute', 'ngSanitize', 'ngCookies', 'ngAnimate', 'ngLocale', 'ui.utils.masks']);

//Objeto global de configuracao
var configs = {
  urlApi: 'https://abacate.herokuapp.com/app/',
  limiteRegistros: 10
};

//Declaracao das rotas
var rotas = {
  home: '/solicitacoes',
  login: '/login',
  solicitacao: '/solicitacao',
  generico: '/:rota'
};

//Configura app
app.config(function ($routeProvider, $locationProvider) {

  //Configura rotas com #!
  $locationProvider.html5Mode(false);

  //Definicao dos arquivos das rotas
  $routeProvider
  .when(rotas.login, {templateUrl: 'views/login.html'})
  .when(rotas.solicitacao, {templateUrl: 'views/solicitacao.html'})
  .when(rotas.generico, {templateUrl: 'views/generic.html'})

  //caso nao seja nenhum desses, redirecione para a home
  .otherwise({redirectTo: rotas.home});
});
