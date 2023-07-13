const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ax6qyiu.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("animalToys");
    const toysCollection = database.collection("toys");

    // add toy api
    app.post("/addToy", async (req, res) => {
      const data = req.body;
      data.createdAt = new Date();

      const result = await toysCollection.insertOne(data);
      res.send(result);
      console.log(result);
    });

    // all toy api

    app.get("/allToys", async (req, res) => {
      const result = await toysCollection.find({}).toArray();
      res.send(result);
    });

    // all category toy api
    app.get("/allToys/:text", async (req, res) => {
      if (
        req.params.text == "Horse" ||
        req.params.text == "Bear" ||
        req.params.text == "Dogs"
      ) {
        const result = await toysCollection
          .find({ category: req.params.text })
          .sort({ createdAt: -1 })
          .toArray();
        return res.send(result);
      }
      const result = await toysCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    });

    // My Toy api
    app.get("/myToys/:email", async (req, res) => {
      const result = await toysCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//

app.get("/", (req, res) => {
  res.send("Hello animal toys");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
