//Define dependecias
var express = require('express');
var app = express();

//Configura pasta dos arquivos
app.use('/', express.static('dist'));

//Inicia servidor na porta 3000
app.listen(3000);

//Mensagem do servidor
console.log('Servidor rodando em 127.0.0.1:3000');
