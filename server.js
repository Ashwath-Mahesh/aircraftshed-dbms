const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

app.post('/api/aircraft', (req, res) => {
    const { flightId, airline, model, capacity, repairCost, quantity, engineSpecs } = req.body;

    const query = 'INSERT INTO aircrafts (flightId, airline, model, capacity, repairCost, quantity, engineSpecs) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [flightId, airline, model, capacity, repairCost, quantity, engineSpecs];

    db.query(query, values, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Aircraft data inserted successfully');
        }
    });
});

app.post('/api/updateAircraft', (req, res) => {
    const { flightId, airline, model, capacity, repairCost, quantity, engineSpecs } = req.body;

    if (!flightId) {
        return res.status(400).send('Flight ID is required');
    }

    let query = 'UPDATE aircrafts SET';
    let values = [];
    const fields = [];

    if (airline !== undefined) {
        fields.push('airline = ?');
        values.push(airline);
    }
    if (model !== undefined) {
        fields.push('model = ?');
        values.push(model);
    }
    if (capacity !== undefined) {
        fields.push('capacity = ?');
        values.push(capacity);
    }
    if (repairCost !== undefined) {
        fields.push('repairCost = ?');
        values.push(repairCost);
    }
    if (quantity !== undefined) {
        fields.push('quantity = ?');
        values.push(quantity);
    }
    if (engineSpecs !== undefined) {
        fields.push('engineSpecs = ?');
        values.push(engineSpecs);
    }

    if (fields.length === 0) {
        return res.status(400).send('No fields to update');
    }

    query += ` ${fields.join(', ')} WHERE flightId = ?`;
    values.push(flightId);

    db.query(query, values, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Aircraft data updated successfully');
        }
    });
});

app.delete('/api/deleteAircraft', (req, res) => {
    const { flightId } = req.body;

    const query = 'DELETE FROM aircrafts WHERE flightId = ?';
    const values = [flightId];

    db.query(query, values, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Aircraft data deleted successfully');
        }
    });
});

app.post('/api/contact', (req, res) => {
    const { name, email, flightId } = req.body;

    const query = 'INSERT INTO Info (name, email, flightId) VALUES (?, ?, ?)';
    const values = [name, email, flightId];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting contact information:', err);
            res.status(500).send(err);
        } else {
            res.status(200).send('Contact information inserted successfully');
        }
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
