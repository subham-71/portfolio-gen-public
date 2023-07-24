const express = require('express');
const {addProject,getProjects, removeProject } = require('../controllers/projectsController.js');

const router = express.Router();

router.post('/getProjects', getProjects);
router.post('/addProject', addProject);
router.post('/removeProject', removeProject);
module.exports = {
    routes: router
}