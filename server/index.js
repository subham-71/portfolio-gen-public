'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const projects = require('./routes/projects');
const  experiences  = require('./routes/experiences');
const home = require('./routes/home');
const email = require('./routes/email');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/projects', projects.routes);
app.use('/exp', experiences.routes);
app.use('/home', home.routes);
app.use('/email',email.routes);

app.get('/', (req,res) => {
    res.send('Welcome to the Portfolio Gen App');
});

app.listen(3000, () => console.log('App is listening on url http://localhost:' + 3000));