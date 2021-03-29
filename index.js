const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// /mongoDB start up
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yedps.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// .mongoDB code
client.connect((err) => {
  const products = client.db('emaJhonStore').collection('products');
  const ordersCollection = client.db('emaJhonStore').collection('orders');

  // perform actions on the collection object
  console.log('setup Successful');

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    products.insertOne(product).then((result) => {
      console.log('result', result);
      res.send(result.insertedCount);
    });
  });
  //

  app.get('/products', (req, res) => {
    products.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // .load specific product
  app.get('/product/:key', (req, res) => {
    const productKey = req.params.key;
    products.find({ key: productKey }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  // . post
  app.post('/productByKeys', (req, res) => {
    const productKey = req.body;
    products.find({ key: { $in: productKey } }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // . add order

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      console.log('result', result);
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(port, () => console.log(`Listening to ${port}`));
