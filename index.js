const express = require('express')
const app = express();
require('dotenv').config()
const cors = require('cors')

const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qjvlr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    await client.connect()
    console.log("Server connect successfully")
    const database = client.db("online_shop")
    const productCollection = database.collection("products")
    const orderCollaction = database.collection("order")

    // GET app
    app.get("/products", async (req, res) => {

        const cursrer = productCollection.find({})
        const page = req.query.page
        const size = parseInt(req.query.size)
        let products;
        const count = await cursrer.count()
        if (page) {
            products = await cursrer.skip(page * size).limit(size).toArray()

        }
        else {
            products = await cursrer.toArray()
        }


        res.send({
            count,
            products
        })
    })


    // post api product
    app.post("/products/pdkey", async (req, res) => {
        const keys = req.body
        const query = { key: { $in: keys } }
        const product = await productCollection.find(query).toArray()


        res.json(product)

    })
    // order post api

    app.post("/order", async (req, res) => {
        const order = req.body;
        const result = await orderCollaction.insertOne(order)
        res.json(result)

    })


}
run().catch(console.dir)


app.get("/", (req, res) => {
    res.send("Emajhon simple is connet ")
})


app.listen(port, () => {
    console.log("Server is conet ", port)
})