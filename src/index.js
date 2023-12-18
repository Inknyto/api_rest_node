const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = 4567;

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(function(req, res, next) {
  console.log(`new connection detected: \nip address: \n${req.ip}`);
  console.log(`URL: ${req.url}`)
  console.log(`Method: ${req.method}`)
  console.log(`Date: ${Date()}`)
  console.log(` `)
  next();
});

app.get('/app/hello', (req, res) => {
  res.send('Hello, World!');
});

app.get('/app/data', async (req, res) => {
  try {
    const data = await fs.readFile('../data/data.json');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get('/app/data2', async (req, res) => {
  try {
    const data2 = await fs.readFile('../data/data2.json');
    res.json(JSON.parse(data2));
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get('/app/datadk', async (req, res) => {
  try {
    const datadk = await fs.readFile('../data/datadk.json');
    res.json(JSON.parse(datadk));
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get('/app/newdata', async (req, res) => {
  try {
    const newdata = await fs.readFile('mynewfile3.json');
    res.json(JSON.parse(newdata));
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post('/bigdata', (req, res) => {
  // code to create a new record in the database or other data source
  res.send('Record created successfully.');
});



app.listen(port, () => {
  console.log(`Listening forever on localhost:${port}`);
});
