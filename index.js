require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5002;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@js-hub.txq7wxp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
  try {
    const db = client.db("js-hub");
    const postCollection = db.collection("posts");
    const productDB = client.db("moontech");
    const productCollection = productDB.collection("product")

    app.get("/posts", async (req, res) => {
      const cursor = postCollection.find({});
      const post = await cursor.toArray();

      res.send({ status: true, data: post });
    });

    app.get("/post/:id" , async(req,res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const post = await postCollection.findOne(query);
      res.send(post)
    })

    app.get("/product", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/posts", async (req, res) => {
      const post = req.body;

      const result = await postCollection.insertOne(post);

      res.send(result);
    });

    app.put("/post/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const updateDoc = {
        $set: data
      }
      const query = {_id: ObjectId(id)}

      const result = await postCollection.updateOne(query, updateDoc)
      res.send(result);
    })

    app.delete("/post/:id", async (req, res) => {
      const id = req.params.id;

      const result = await postCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
