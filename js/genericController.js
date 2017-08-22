//Controller generico pode ser usado em qualquer pagina
app.controller("genericController", function($scope, $location) {

  //Disponibiliza variavel com data atual
  $scope.hoje = new Date();

  $scope.efetuarLogin = function () {
    $scope.sessao.logado = true;
    $location.path(rotas.home);
  };
});
