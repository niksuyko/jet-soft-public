const bcryptjs = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
const twilio = require('twilio');
const serverless = require('serverless-http');
const AWS = require('aws-sdk');

const app = express();

// cors headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://main.d1wdt1x8648ubf.amplifyapp.com');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// fetch certificate from aws
async function getRdsCaCert() {
    const secretsManager = new AWS.SecretsManager();
    const secretName = 'rds-ca-cert';
    
    try {
        const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        if ('SecretString' in data) {
            return data.SecretString;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            return buff.toString('ascii');
        }
    } catch (err) {
        console.error('Error fetching RDS CA cert:', err);
        throw err;
    }
}

// create database pool with SSL configuration
async function createPool() {
    const caCert = await getRdsCaCert();
    return new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: true,
            ca: caCert,
        }
    });
}

let pool;

// initialize database pool
createPool().then(createdPool => {
    pool = createdPool;
}).catch(err => {
    console.error('Error creating database pool:', err);
});

// twilio client setup
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(403).json({ error: 'A token is required for authentication' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (username !== ADMIN_USERNAME) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const match = await bcryptjs.compare(password, ADMIN_PASSWORD);
    if (match) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

// get all clients
app.get('/api/clients', authenticateToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM clients');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// add a new client
app.post('/api/clients', authenticateToken, async (req, res) => {
    try {
        const { name, phone_number, tail_number, additional_comments, priority } = req.body;
        const newClient = await pool.query(
            'INSERT INTO clients (name, phone_number, tail_number, additional_comments, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, phone_number, tail_number, additional_comments, priority]
        );
        res.json(newClient.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// update a client
app.put('/api/clients/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone_number, tail_number, additional_comments, priority } = req.body;
        const updateClient = await pool.query(
            'UPDATE clients SET name = $1, phone_number = $2, tail_number = $3, additional_comments = $4, priority = $5 WHERE id = $6 RETURNING *',
            [name, phone_number, tail_number, additional_comments, priority, id]
        );
        res.json(updateClient.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// delete a client
app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM clients WHERE id = $1', [id]);
        res.json({ message: 'Client deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// send a text message
app.post('/api/send-text', authenticateToken, async (req, res) => {
    const { phoneNumber, message } = req.body;

    try {
        const sms = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        res.json({ success: true, messageSid: sms.sid });
    } catch (err) {
        console.error('Twilio SMS Send Error:', err.message);
        res.status(500).json({ error: 'Server error during SMS sending' });
    }
});

// verify server running
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// export handler for AWS Lambda
module.exports.handler = serverless(app);
