const axios = require('axios');
const Dev = require('../models/Dev')

// utilização do async por conta do await na frente do axios.get, pois esse get pode não retornar imediatamente, 
// então colocamos o await para aguardar o retorno do get e só então continuar a execução na proxima linha
module.exports = {
    async index(req, res){
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);
        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } }, // traz usuarios que o id não seja igual ao usuario logado - ne: not equal
                { _id: { $nin: loggedDev.likes } }, // traz usuarios que não estão na lista de likes - nin - not in
                { _id: { $nin: loggedDev.dislikes } } // traz usuarios que não estão na lista de dislikes - nin - not in
            ],
        })

        return res.json(users);
    },

    async store(req, res){
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });

        if (userExists){
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);
        
        const { name, bio, avatar_url: avatar } = response.data;

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
         })

        return res.json(dev);
    }
};