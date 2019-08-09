const { Schema, model } = require('mongoose');

/**
 * Modelo da dados da tabela Dev
 */
const DevSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
        },
    bio: String,
    avatar: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Dev',
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'Dev',
    }],
}, {
    // cria duas colunas no banco de dados createAt e updatedAt
    // preenche automaticamente a data de criação e/ou atualização 
    timestamps: true,
});

// exportação do modelo de dados e do Schema, 
// através do Schema será possivel realizar as transações necessarias (save, delete, etc) na tabela Dev.
module.exports = model('Dev', DevSchema);