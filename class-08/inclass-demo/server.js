'use strict';

// Bring in our dependencies
const express = require('express');
const pg = require('pg');

require('dotenv').config();

// Create a port for our server to listen on

const PORT = process.env.PORT || 3000;

// Create our express instance/application
const app = express();

// Create our postgres client
const client = new pg.Client(process.env.DATABASE_URL);

// Route

app.get('/add', (req, res) => {
    const firstName = req.query.first;
    const lastName = req.query.last;

    const SQL = `INSERT INTO people (first_name, last_name) VALUES ($1, $2) RETURNING *`;
    const safeValues = [firstName, lastName];

    client.query(SQL, safeValues)
        .then( results => {
            res.status(200).json(results.rows);
        })
        .catch( error => {
            console.log('Error', error)
            res.status(500).send('Something went wrong');
        })
});

app.get('/people', (req, res) => {
    const SQL = 'SELECT first_name, last_name FROM people';

    client.query(SQL)
        .then( results => {
            res.status(200).json(results.rows);
        })
        .catch( error => {
            console.log('Error', error);
            res.status(500).send('Something went wrong');
        })
});


app.use('*', notFoundHandler);


// Function Handlers

function notFoundHandler(req, res) {
    res.status(404).send('Not found!');
}

// Connect to our database and start our server

client.connect()
    .then( () => {
        app.listen(PORT, () => {
            console.log(`Now listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log('ERROR', err);
    })