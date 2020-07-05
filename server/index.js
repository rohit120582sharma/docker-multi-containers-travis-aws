const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const { Pool } = require('pg');

const keys = require('./keys');

// Postgres client setup
const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    user: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase,
});
pgClient.on('error', () => {
    console.log('Postgres connection is lost...');
});
pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err));

// Redis client setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hi');
});
app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});
app.get('/values/current', (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});
app.post('/values', async (req, res) => {
    const index = req.body.index;

    // Limit the index value for computation
    if(parseInt(index) > 40) {
        res.statusCode(422).send('Very high value!');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);

    await pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({
        working: true
    });
});

app.listen(5000, () => {
    console.log('Server is listening on port 5000');
});
