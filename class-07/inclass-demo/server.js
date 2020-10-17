'use strict';

// Bring in our dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const { response } = require('express');

// Environment variables
require('dotenv').config();

// Set up our application
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// Routes
app.get('/location', locationHandler);
app.use('*', notFoundHandler);






// Route handlers
function locationHandler(req, res) {
    let city = req.query.city;
    let key = process.env.LOCATIONIQ_API_KEY;
    
    const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

    superagent.get(URL)
        .then(data => {
            let location = new Location(city, data.body[0]);
            res.status(200).json(location);
        })
        .catch((error) => {
            console.log('error', error);
            res.status(500).send('Your API call did not work?');
        })
}

function notFoundHandler(req, res) {
    res.status(404).send('Try again.');
}

// Constructors
function Location(city, locationData) {
    this.search_query = city;
    this.latitude = locationData.lat;
    this.longitude = locationData.lon;
    this.formatted_query = locationData.display_name;
}



// Start our server
app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}.`);
})