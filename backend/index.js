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