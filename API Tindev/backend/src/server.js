const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// importação das rotas do arquivo routes.js
const routes = require('./routes');

const httpServer = express();

// faz com que aplicação aceite conexão websocket ou http.
const server = require('http').Server(httpServer);
const io = require('socket.io')(server);

const connectedUsers = {};

// permite a transição de mensagens entre o back e o front end em tempo real.
io.on('connection', socket => {
    const { user } = socket.handshake.query;

    // inicializando a variavel connectedUsers, com padrão chave valor (id_do_usuario: id_socket_do_usuario).
    connectedUsers[user] = socket.id;
});

// criação da conexão com o banco de dados MongoDB.
mongoose.connect('mongodb+srv://root:root@cluster0-vntfx.mongodb.net/omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

// criação do middleware (interceptador), como se fosse uma rota
// intercepta a requisição para tratamento do request antes dele chegar no controller
// quando a requisição chegar primeiro vai parar aqui, e depois seguir o fluxo (next)
httpServer.use((req, res, next) => {

    // adicionando valores no request pare serem recuperados no controller.
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

httpServer.use(cors());

// informa que estamos trabalhando com JSON
httpServer.use(express.json());

// adiciona as rotas no servidor
httpServer.use(routes);

// porta que a aplicação poderá ser acessada.
server.listen(3333);