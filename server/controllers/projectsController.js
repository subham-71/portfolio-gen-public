'use strict';

const { db } = require('../db');


const getProjects = async (req, res) => {

   try {
        const clientId = req.body.clientId;
        const response =await db.collection('Users').doc(clientId).collection('projects').get();
        
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

const addProject = async(req,res) => {
    try {
        const clientId = req.body.clientId;
        const name = req.body.name;
        const project = req.body.project;
        const response =await db.collection('Users').doc(clientId).collection('projects').doc(name).set(project);
        
        res.send(response);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const removeProject = async(req,res) => {
    try {
        const clientId = req.body.clientId;
        const name = req.body.name;
        
        const response =await db.collection('Users').doc(clientId).collection('projects').doc(name).delete();
        
        res.send(response);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    getProjects,
    addProject,
    removeProject
}
