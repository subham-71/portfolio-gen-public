'use strict';

const { db } = require('../db');


const getExperiences = async (req, res) => {

   try {
        const clientId = req.body.clientId;

        const response =await db.collection('Users').doc(clientId).collection('experiences').get();
        
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

const addExperience = async(req,res) => {
    try {
        const clientId = req.body.clientId;
        const name = req.body.name;
        const exp = req.body.exp;
        const response =await db.collection('Users').doc(clientId).collection('experiences').doc(name).set(exp);
        
        res.send(response);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const removeExperience = async (req, res) => {
  try {
    const { clientId, name } = req.body;
    const response = await db
      .collection('Users')
      .doc(clientId)
      .collection('experiences')
      .doc(name)
      .delete();

    res.send(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


module.exports = {
    getExperiences,
    addExperience,
    removeExperience
}
