const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.insvee7.mongodb.net/?retryWrites=true&w=majority`;

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


        const touristSpotsCollection = client.db('TouristSpots').collection('spots');

        // app.post('/theme', async(req, res) => {
        //     const data = {theme : "light"};
        //     const result = await themeCollection.insertOne(data);

        //     res.send(result);
        // })

        app.get('/allSpots', async (req, res) => {
            const result = await touristSpotsCollection.find().limit(6).toArray();
            res.send(result);
        })
        app.get('/allTouristSpots', async (req, res) => {
            const result = await touristSpotsCollection.find().toArray();
            res.send(result);
        })
        app.get('/spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id : new ObjectId(id)};
            const result = await touristSpotsCollection.findOne(query);
            res.send(result);
        })
        app.post('/addSpot', async (req, res) => {
            const spot = req.body;
            // console.log(spot);
            const result = await touristSpotsCollection.insertOne(spot);
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



app.get('/', (req, res) => {
    res.send('Welcome to Travel all over the world!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})