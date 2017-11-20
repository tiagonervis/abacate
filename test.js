//Obtem depedencias
var assert = require('assert');
var request = require('request');
var fs = require('fs');

//Endereco da api
var urlApi = 'https://abacate.herokuapp.com/app/';

//Define usuario e senha
var usuario = 'admin';
var senha = 'admin';

//Objeto de fachadas para testes
var fachadas = {
  equipamentos: {descricao: ''},
  locais: {local: ''},
  registros_logs: {tabela: ''},
  marcas: {descricao: '' },
  pontos: {codPonto: '' },
  racks: {identificacao: '' },
  responsaveis: {nome: '' },
  situacoes: {situacao: '' },
  solicitacoes: {ponto: { codPonto: ''} },
  cabling: {cabling: '' },
  tipos_equipamentos: {tipo: '' },
  tipos_racks: {tipo: '' },
  tipos_servicos: {tipo: '' },
  tipos_solicitacoes: {tipo: '' },
  terminacoes: {terminacao: '' },
  usuarios: {nome: '' }
};

//Teste 1
describe('1 - Consultando acesso sem autenticação:', function() {

  //Define tempo maximo para expirar
  this.timeout(20000);

  //Percorre todas as fachadas
  for (let fachada in fachadas) {

    //Executa testa da fachada atual
    it(fachada, function (done) {

      //Monta url de pesquisa
      let url = fachada + '/pesquisar?pagina=0&quantidade=10';

      //Executa consulta api
      consultaApi(url, 'POST', null, fachadas[fachada], function (res) {

        //Verifica se recebeu resposta 500
        assert.equal(res.statusCode, 500, res.statusMessage);

        //Finaliza o teste
        done();
      });
    });
  }
});

//Teste 2
describe('2 - Consultando acesso com autenticação:', function() {

  //Define tempo maximo para expirar
  this.timeout(20000);

  //Converte usuario e senha em base64
  var buffer = new Buffer(usuario + ':' + senha);
  var auth = buffer.toString('base64');

  //Percorre todas as fachadas
  for (let fachada in fachadas) {

    //Executa testa da fachada atual
    it(fachada, function (done) {

      //Monta url de pesquisa
      let url = fachada + '/pesquisar?pagina=0&quantidade=10';

      //Executa consulta api
      consultaApi(url, 'POST', auth, fachadas[fachada], function (res) {

        //Verifica se recebeu resposta 200
        assert.equal(res.statusCode, 200, res.statusMessage);

        //Finaliza o teste
        done();
      });
    });
  }
});

//Funcao para consulta a api
function consultaApi(fachada, metodo, auth, dados, callback) {

  //Define configuracoes da requisicao
  let configs = {
    method: metodo,
    url: urlApi + fachada,
    headers: {}
  };

  //Se foi informada autenticacao
  if (auth !== null) {

    //Define autenticacao no cabecalho autorization
    configs.headers['Authorization'] = auth;
  }

  //Se dados foram informados
  if (dados !== null) {

    //Define tipo de conteudo json
    configs.headers['Content-Type'] = 'application/json';

    //Insere dados no corpo
    configs.json = dados;
  }

  //Executa requisicao
  request(configs, function (err, res, body) {

    //Chama callback com resposta
    callback(res);
  });
};
