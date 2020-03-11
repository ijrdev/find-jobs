const Vagas = require('../models/jobs');

const getJobs = () => {
    return Vagas.find();
};

const addJob = (job) => {
    return Produtos.create(job);
};

module.exports = {getJobs, addJob};

