'use strict';


// Bring in our dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const { request } = require('express');
require('dotenv').config();

// Application setup
const app = express();

// Create a port for our server to listen on
const PORT = process.env.PORT || 3000;

// Enable cors
app.use( cors() );

// Routes

app.get('/location', locationHandler);
app.get('/restaurants', restaurantHandler);
app.use('*', notFoundHandler);


// Local cache for our location
const locations = {};




// Function handlers

function locationHandler(req, res){

    const city = req.query.city;
    const key = process.env.GEOCODE_API_KEY;
    
    const API = 'https://us1.locationiq.com/v1/search.php/';

    if(locations[city]) {
        console.log('grabbing cache');
        res.send(locations[city]);
    }
    else {

        const queryParams = {
            key: key,
            q: city,
            format: 'json',
            limit: 1
        }

        superagent.get(API)
            .query(queryParams)
            .then(data => {
                const location = new Location(city, data.body[0]);
                locations[city] = location;
                res.send(location);
            });
    }
}

function restaurantHandler(req, res){

    const numPerPage = 5;
    const page = req.query.page || 1;
    const start = ((page - 1) * numPerPage + 1);
    
    const API = 'https://developers.zomato.com/api/v2.1/search';

    console.log('start', start); 
    const queryParams = {
        lat: req.query.latitude,
        start: start,
        count: numPerPage,
        lon: req.query.longitude
    }

    console.log('queryParams', queryParams);
    superagent.get(API)
        .set('user-key', process.env.ZOMATO_API_KEY)
        .query(queryParams)
        .then( data => {
            const results = data.body.restaurants;
            // console.log('results', results);
            const restaurantData = [];
            results.forEach(entry => {
                restaurantData.push(new Restaurant(entry));
            });
            res.send(restaurantData);
        })
        .catch((error) => {
            // console.log('error', error)
            res.status(500).send('Something went wrong.');
        })

}

function notFoundHandler(req, res){
    res.status(404).send('Not found!');
}


// Constructors

function Location(city, geoData){
    this.search_query = city;
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;
}

function Restaurant(entry) {
    this.restaurant = entry.restaurant.name;
    this.cuisines = entry.restaurant.cuisines;
    this.locality = entry.restaurant.locality;
}


// Have our server listen on a port
app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}.`);
})