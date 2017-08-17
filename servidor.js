const static = require('node-static');
const http = require('http');

var file = new static.Server('./dist');

http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(3000);

console.log("Servidor rodando em 127.0.0.1:3000");
