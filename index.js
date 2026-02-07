const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@serverclusterkarmokarbi.xqmpedv.mongodb.net/?appName=ServerClusterKarmokarBijoy`;

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
    await client.connect();
    const jobsCollection = client.db("JobPortal").collection('jobs');
    const applicationsCollection = client.db("JobPortal").collection("applications");

    app.get('/jobs',async(req,res)=>{
        const result = await jobsCollection.find().toArray();
        res.send(result);
    })

    app.get("/jobs/:id",async(req,res)=>{
         const id = req.params.id;
         const qurey = {_id : new ObjectId(id)};
         const result = await jobsCollection.findOne(qurey);
         res.send(result);
    })
  //  application info
    app.get('/applications', async(req,res)=>{
      const email = req.query.email;
      const qurey ={
        applicant: email
      }
      const result = await applicationsCollection.find(qurey).toArray();
      res.send(result);
    })

    app.post("/applications", async(req,res)=>{
      const applicaionInfo = req.body;
      const result = await applicationsCollection.insertOne(applicaionInfo);
      res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/",(req,res)=>{
    res.send("Job Portal added succcessFully.");
})

app.listen(port,()=>{
    console.log(`server is running at :http://localhost:${port}`);
})