const Jobs = require('../models/jobs');

const getJob = (email) => {
    return Jobs.find(email);
};

const getJobs = () => {
    return Jobs.find();
};

const addJob = (job) => {
    return Jobs.create(job);
};

module.exports = {getJob, getJobs, addJob};