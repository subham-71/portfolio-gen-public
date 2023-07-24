const express = require('express');
const { getExperiences,addExperience, removeExperience} = require('../controllers/experiencesController.js');

const router = express.Router();

router.post('/getExps', getExperiences);
router.post('/addExp', addExperience);
router.post('/removeExp', removeExperience);

module.exports = {
    routes: router
}