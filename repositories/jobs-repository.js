const Jobs = require('../models/jobs');

const getJob = (email) => {
    return Jobs.find(email);
};

const getJobs = (job) => {
    return Jobs.find(job);
};

const addJob = (job) => {
    return Jobs.create(job);
};

module.exports = {getJob, getJobs, addJob};