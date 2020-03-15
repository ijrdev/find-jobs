const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;
const dateAndTime = require('date-and-time');

mongoose.connect('mongodb://localhost/find_jobs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB ON!');
}).catch((error) =>{
    console.log(error);
});

const FindJobs = mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
    date: {
        type: String,
        default: dateAndTime.format(new Date(), 'DD/MM/YYYY')
    },
    site: {
        type: String,
        trim: true,
        require: true
    },
    tag: {
        type: String,
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('jobs', FindJobs);