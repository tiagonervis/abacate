//Declaracao da aplicacao
var app = angular.module("app", ['ngRoute', 'ngSanitize', 'ngLocale']);

//Declaracao das rotas
var rotas = {
  login: '/login',
  home: '/home'
};
/*
//Configura app
app.config(function ($routeProvider, $locationProvider) {

  //Remove o # da url
  $locationProvider.html5Mode(true);

  //Definicao dos arquivos das rotas
  $routeProvider
  .when(rotas.login, {templateUrl: 'views/login.html'})

  //caso nao seja nenhum desses, redirecione para a home
  .otherwise({redirectTo: '/login'});
  });
*/
