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
        const allCountries = client.db('TouristSpots').collection('Countries');

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
        app.get('/allSortedTouristSpots', async (req, res) => {
            const result = await touristSpotsCollection.find().sort({avgCost:1}).toArray();
            res.send(result);
        })
        app.get('/spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristSpotsCollection.findOne(query);
            res.send(result);
        })
        app.post('/addSpot', async (req, res) => {
            const spot = req.body;
            // console.log(spot);
            const result = await touristSpotsCollection.insertOne(spot);
            res.send(result);
        })

        app.get('/mySpots/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await touristSpotsCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristSpotsCollection.deleteOne(query);
            res.send(result)
        })
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const spotInfo = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const UpdatedSpotInfo = {
                $set: {

                    photoUrl: spotInfo.photoUrl,
                    spotName: spotInfo.spotName,
                    country: spotInfo.country,
                    location: spotInfo.location,
                    description: spotInfo.description,
                    avgCost: spotInfo.avgCost,
                    season:spotInfo.season,
                    travelTime:spotInfo.travelTime,
                    totalVisitors:spotInfo.totalVisitors
                }
            }
            const result = await touristSpotsCollection.updateOne(filter, UpdatedSpotInfo, options);
            res.send(result)
        })


        //countries
        app.get('/countries', async (req, res) => {
            const result = await allCountries.find().toArray();
            res.send(result);
        })

        app.get('/countrySpots/:country', async (req, res) => {
            const country = req.params.country;
            // console.log(country)
            const query = { country: country };
            const result = await touristSpotsCollection.find(query).toArray();
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