const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

mongoose.connect('mongodb://localhost/find-jobs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB ON!');
}).catch((error) =>{
    console.log(error);
});

const Vagas = mongoose.Schema({
    titulo: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
});

module.exports = mongoose.model('vagas', Vagas);