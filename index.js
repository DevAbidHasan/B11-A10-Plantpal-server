require('dotenv').config()
const express = require('express');

const cors =require('cors');
const app = express ();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcbondo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const plantCollection = client.db("plantDB").collection("plants");

    app.post("/plants", async (req,res)=>{
        const newPlant =  req.body;
        const result = await plantCollection.insertOne(newPlant);
        res.send(result);
    })


    app.get("/update-plant/:id", async (req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await plantCollection.findOne(query);
      res.send(result);
    })


    // update plant API

    app.put("/update-plant/:id", async (req,res)=>{
      const id= req.params.id;
      const filter = { _id : new ObjectId(id)};
      const options = { upsert : true };
      const updatedPlant = req.body;
      const updatedDoc = {
        $set : updatedPlant
      }
      const result = await plantCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })


    // delete any plant from database

    app.delete("/plants/:id", async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await plantCollection.deleteOne(query);
      res.send(result);
    })


    app.get("/plants/:id",async (req,res)=>{
        const id=req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await plantCollection.findOne(query);
        res.send(result);
    })

    app.get("/my-plants/:email", async (req,res)=>{
        const email = req.params.email;
        const query = { email : email};
        const result = await plantCollection.find(query).toArray();
        res.send(result);
    })


    app.get("/plants", async (req,res)=>{
        const result = await plantCollection.find().toArray();
        res.send(result);
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req,res)=>{
    res.send("this is homepage");
})

// add plant
app.get("/add-plant", (req,res)=>{
    res.send("this is add plant page");
})



app.listen(port, ()=>{
    console.log("port number : ", port);
})