const { Pool } = require('pg');
const fs = require('fs');
const bodyParser = require('body-parser');



const pool = new Pool({
  user: 'nyto',
  host: 'localhost',
  database: 'dall_diamm',
  password: 'thedatabase',
  port: 5432, // default PostgreSQL port
});

const express = require('express');

const app = express();
let i=0
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    i=i+1;
    console.log("Nombre de requêtes: ",i)
    next();
  });

  app.use(function(req, res, next) {
    console.log(`new connection detected:`);
    console.log(`IP: ${req.ip}`)
    console.log(`URL: ${req.url}`)
    console.log(`Method: ${req.method}`)
    console.log(`Date: ${Date()}`)
    console.log(` `)
    next();
  });

const l = ['electronique', 'electromenager', 'luminaire'];

const idColumns = {
  electronique: "id_e",
  electromenager: "id_ap",
  luminaire: "id_l"
};

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.write("Vous pouvez visiter l'url /electronique pour les données électroniques,\n");
  res.write("l'url /electromenager pour les données électroménagers,\n");
  res.write("et l'url /luminaire pour les données luminaires\n");
  res.end();
});

for (let i of l) {
  // Route pour récupérer toutes les données de la catégorie
  app.get(`/${i}`, async (req, res) => {
    try {
      const query = `SELECT * FROM ${i}`;
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  // Route générique pour récupérer les données de la catégorie en fonction de l'ID
  app.get(`/${i}/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      const idColumn = idColumns[i];
      const query = `SELECT * FROM ${i} WHERE ${idColumn} = $1`;
      const values = [id];
      const { rows } = await pool.query(query, values);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
}

app.post('/:category', async (req, res) => {
  const category = req.params.category;
  try {
    let query = '';
    let values = [];
    
    switch (category) {
      case 'electronique':
        const { nom, prix, imagel } = req.body;
        query = 'INSERT INTO electronique (nom, prix, image) VALUES ($1, $2, $3)';
        values = [nom, prix, imagel];
        break;
      case 'electromenager':
        const { nom_ap, emp_ap, prix_ap, img_ap } = req.body;
        query = 'INSERT INTO electromenager (nom_ap, emp_ap, prix_ap, img_ap) VALUES ($1, $2, $3, $4)';
        values = [nom_ap, emp_ap, prix_ap, img_ap];
        break;
      case 'luminaire':
        const { nom_l, prix_l, description, image } = req.body;
        query = 'INSERT INTO luminaire (nom_l, prix_l, description, image) VALUES ($1, $2, $3, $4)';
        values = [nom_l, prix_l, description, image];
        break;
      default:
        throw new Error(`Invalid category: ${category}`);
    }

    await pool.query(query, values);
    res.json({ message: 'New item created successfully' });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.put('/:category/:id', async (req, res) => {
  const category = req.params.category;
  const idColumn = idColumns[category];
  try {
    const id = req.params.id;
    let query = '';
    let values = [];
    
    switch (category) {
      case 'electronique':
        const { nom, prix, imagel } = req.body;
        query = `UPDATE electronique SET nom = $1, prix = $2, image = $3 WHERE ${idColumn} = $4`;
        values = [nom, prix, imagel, id];
        break;
      case 'electromenager':
        const { nom_ap, emp_ap, prix_ap, img_ap } = req.body;
        query = `UPDATE electromenager SET nom_ap = $1, emp_ap = $2, prix_ap = $3, img_ap = $4 WHERE ${idColumn} = $5`;
        values = [nom_ap, emp_ap, prix_ap, img_ap, id];
        break;
      case 'luminaire':
        const { nom_l, prix_l, description, image } = req.body;
        query = `UPDATE luminaire SET nom_l = $1, prix_l = $2, description = $3, image = $4 WHERE ${idColumn} = $5`;
        values = [nom_l, prix_l, description, image, id];
        break;
      default:
        throw new Error(`Invalid category: ${category}`);
    }

    await pool.query(query, values);

    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


// DELETE request for deleting an item
app.delete('/:category/:id', async (req, res) => {
  const category = req.params.category;
  const idColumn = idColumns[category];
  try {
    const id = req.params.id;

    const query = `DELETE FROM ${category} WHERE ${idColumn} = $1`;
    const values = [id];

    await pool.query(query, values);

    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(404).send("Erreur 404: Cet url n'existe pas");
});

module.exports = app;
