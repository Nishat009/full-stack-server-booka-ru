const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5500;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktoki.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors())
app.use(express.json());



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookCollection = client.db("bookDB").collection("books");
    const ordersCollection = client.db("bookDB").collection("orders");

    app.get('/books', (req, res) => {
        bookCollection.find()
            .toArray((error, books) => {
                res.send(books)
            })
    })

    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        bookCollection.insertOne(newBook)
            .then(result => [
                console.log('inserted count', result.insertedCount),
                res.send(result.insertedCount > 0)
            ])
            console.log("successful")
    })

    app.get('/books/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        bookCollection.find({ _id: id })
          .toArray((err, books) => {
            res.send(books[0]);
          })
      })

      //delete

      app.delete('/deleteBook/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        bookCollection.deleteOne({ _id: id })
          .then(result => {
            res.send(result.deletedCount > 0)
          })
      })
    

      app.post('/buyBook', (req, res) => {
        const newBook = req.body;
        ordersCollection.insertOne(newBook)
          .then(result => {
            res.send(result.insertedCount > 0);
          })
    
      })

      app.get('/orderPreview', (req, res) => {
        ordersCollection.find({ email: req.query.email })
          .toArray((err, orders) => {
            res.send(orders);
          })
      })
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port);