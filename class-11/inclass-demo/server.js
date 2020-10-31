'use strict';


// bring in our dependencies

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

require('dotenv').config();

// Create port
const PORT = process.env.PORT || 3000;

// Start express application
const app = express();

// CORS
app.use(cors());

// Where my server will look for pages to serve to the browser
app.use(express.static('./public'));

// Decode our POST data
app.use(express.urlencoded({ extended: true }));

// Set default view engine
app.set('view engine', 'ejs');

// Routes

app.get('/', (request, response) => {
  const first = 'millie';
  const petNames = [
    'scooby',
    'stormageddon',
    'elliot',
    'maisie',
    'oz',
    'lemon',
    'jalapeno',
    'ollie',
    'obi juan',
    'randal',
    'lady',
    'kora',
    'maybell',
    'dobbie',
    'lucipurr',
    'marvel',
    'jupitaurious'
  ];

  const data = {
    pets: petNames,
    name: 'michael'
  };

  response.status(200).render('index', data);
});

app.post('/contact', (request, response) => {
  // const firstName = request.query.first; //app.get
  // const lastName = request.query.last;  //app.get

  const firstName = request.body.first; //app.post
  const lastName = request.body.last;  //app.post

  console.log(firstName, lastName);
  response.status(200).send(firstName + ' ' + lastName);

});


// Start our server
app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));
