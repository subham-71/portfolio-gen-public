'use strict';

const { db } = require('../db');


const getAbout = async (req, res) => {

   try {
        const clientId = req.body.clientId;
        const response =await db.collection('Users').doc(clientId).collection('about').get();
        
        let resposneArr = [];
        response.forEach(doc => {
            resposneArr.push(doc.data());
        });

        res.send(resposneArr);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const addAbout = async(req,res) => {
    try {
        const clientId = req.body.clientId;
        const about = req.body.about;
    
        const response =await db.collection('Users').doc(clientId).collection('about').doc('details').set(about);
        
        res.send(response);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    getAbout, addAbout
}
