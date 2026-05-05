var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = "8080";
const host = "localhost";
//Add MongoDB
const { MongoClient } = require("mongodb");
//Add Constants
const url = "mongodb://127.0.0.1:27017";
const dbName = "aethera_airways";
const client = new MongoClient(url);
const db = client.db(dbName);
const collection = "flights";
app.listen(port, () => {
    console.log("App listening at http://%s:%s",
    host, port);
});
app.get("/", async (req, res) => {
    res.send("welcom to aethera")
})
app.get("/listFlights", async (req, res) => {
    await client.connect();
    const query ={};
    const results = await db
    .collection(collection)
    .find(query)
    .limit(10)
    .toArray();
    
    res.status(200).send(results);
}
)
app.post("/addUser", async (req, res) => {
    try {
        await client.connect();
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        
        const newDocument = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
        };
        console.log(newDocument);
        const result = await db.collection("robot").insertOne(newDocument);
        res.status(200);
        res.send(result);
    } catch (error) {
        console.error("Could not add the new Robot" + error);
        res.status(500);
        res.send("Error adding new robot");
    } finally {
        await client.close();
    }
}
);