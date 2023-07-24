const express = require('express');
const {addAbout, getAbout} = require('../controllers/homeController.js');
const router = express.Router();

router.post('/getAbout', getAbout);
router.post('/addAbout', addAbout);

module.exports = {
    routes: router
}