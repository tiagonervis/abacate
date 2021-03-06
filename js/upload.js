//Funcao para efetuar o upload de uma imagem
function upload(e) {

  //Caso array de arquivos nao tenha elementos retorna
  if (e.target.files.length === 0) {
    return;
  }

  //Variavel local com a instancia do escopo da tela
  var $scope = angular.element(document.getElementById("tela")).scope();

  //Procura campo no array de campos baseado no id recebido no evento
  var campo = $scope.model.campos.find((atual) => atual.campo === e.target.id);

  //Se nao encontrou o campo retorna
  if (campo === undefined) {
    return;
  }

  //Cria um novo leitor de arquivos
  var reader = new FileReader();

  //Declara evento para ser chamado ao carregar arquivo
  reader.addEventListener("load", function () {

    //Salva arquivo na variavel da view
    $scope.view[campo.arquivo] = e.target.files[0];

    //Cria um novo objeto image
    var img = new Image();

    //Cria uma novo canvas
    var canvas = document.createElement('canvas');

    //Obtem o contexto 2d do canvas
    var context = canvas.getContext('2d');

    //Ao carregar imagem
    img.onload = function() {

      //Define largura maxima
      var largura = 1000;

      //Define altura maxima
      var altura = 700;

      //Inicia fator de divisao em 1
      var divisor = 1;

      //Se a largura for maior que o maximo
      if (img.width > largura) {

        //Calcula fator de divisao com base na largura
        divisor = img.width / largura;
      }

      //Se a altura aplicando divisor for maior que o maximo
      if ((img.height / divisor) > altura) {

        //Calcula faotr de divisao com base na altura
        divisor = img.height / altura;
      }

      //Define tamanho do canvas com base na imagem
      canvas.width = img.width / divisor;
      canvas.height = img.height / divisor;

      //Desenha imagem no canvas
      context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

      //Obtem conteudo do canvas em jpeg
      var jpg = canvas.toDataURL("image/jpeg", 0.7);

      //Salva imagem na variavel da view
      $scope.view.selecionado[campo.campo] = jpg;

      //Aplica alteracoes no escopo
      $scope.$apply();
    }

    //Carrega imagem com conteudo do file reader
    img.src = reader.result;

  }, false);

  //Carrega o arquivo do campo
  reader.readAsDataURL(e.target.files[0]);
};
