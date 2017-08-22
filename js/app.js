//Declaracao da aplicacao
var app = angular.module("app", ['ngRoute', 'ngSanitize', 'ngCookies', 'ngAnimate', 'ngLocale']);

//Objeto global de configuracao
var configs = {
  urlApi: 'https://jsonplaceholder.typicode.com/'
};

//Declaracao das rotas
var rotas = {
  home: '/home',
  login: '/login',
  solicitacao: '/solicitacao',
  usuarios: '/usuarios'
};

//Configura app
app.config(function ($routeProvider, $locationProvider) {

  //Remove o # da url
  $locationProvider.html5Mode(true);

  //Definicao dos arquivos das rotas
  $routeProvider
  .when(rotas.home, {templateUrl: 'views/home.html'})
  .when(rotas.login, {templateUrl: 'views/login.html'})
  .when(rotas.solicitacao, {templateUrl: 'views/solicitacao.html'})
  .when(rotas.usuarios, {templateUrl: 'views/usuarios.html'})

  //caso nao seja nenhum desses, redirecione para a home
  .otherwise({redirectTo: '/home'});
  });
