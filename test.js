//Obtem depedencias
var assert = require('assert');
var request = require('request');
var fs = require('fs');

//Endereco da api
var urlApi = 'https://abacate.herokuapp.com/app/';

//Define usuario e senha
var usuario = 'admin';
var senha = 'admin';

var buffer = new Buffer(usuario + ':' + senha);
var auth = buffer.toString('base64');

var models = [];

describe('Executando testes:', function () {

  this.timeout(20000);

  after(function(done) {

    fs.readdir('models', function (erro, arquivos) {

      var pendentes = arquivos.length;
      for (var i in arquivos) {

        let arquivo = arquivos[i];

        fs.readFile('models/' + arquivo, 'utf8', function(erro, conteudo) {

          models.push(JSON.parse(conteudo));

          pendentes--;

          if (pendentes === 0) {
            done();
          }
        });
      }
    });

  });

 it('teste', function() {

   console.log(models);
   for (var i in models) {

     let model = models[i];

     it(model[i], function (done) {

         url = model.url + '/pesquisar?pagina=0&quantidade=10';

         obj = {};
         obj[model.busca.campo] = '';

         consultaApi(url, 'POST', null, obj, function (res) {
           assert.equal(res.statusCode, 500, res.statusMessage);
           done();
         });
       });
   }
 });

});

/*

describe('3 - Consultando acesso do usuário:', function() {

  this.timeout(20000);

  for (let fachada in fachadas) {

    it(fachada, function (done) {

      let model = fachadas[fachada];

      url = fachada + '/pesquisar?pagina=0&quantidade=10';

      obj = {};
      obj[model.busca.campo] = '';

      consultaApi(url, 'POST', auth, obj, function (res) {
        assert.equal(res.statusCode, 200, res.statusMessage);
        done();
      });
    });
  }
});
*/
function carregarModel(arquivo, callback) {
  fs.readFile(arquivo, 'utf8', function(erro, conteudo) {
    if (!erro) {
      callback(JSON.parse(conteudo));
    }
  });
}

function consultaApi(fachada, metodo, auth, dados, callback) {

  let configs = {
    method: metodo,
    url: urlApi + fachada,
    headers: {}
  };

  if (auth !== null) {
    configs.headers['Authorization'] = auth;
  }

  if (dados !== null) {
    configs.headers['Content-Type'] = 'application/json';
    configs.json = dados;
  }

  request(configs, function (err, res, body) {
    callback(res);
  });
};
