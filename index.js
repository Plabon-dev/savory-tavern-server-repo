const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// hjf hf hd dhd dhd hdhd hdhd hdhd hdhd hdhd hdhd dhd hd hdhd hdhd 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ull5nsx.mongodb.net/?retryWrites=true&w=majority`;

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
    const foodCollection = client.db('savoryTavern').collection('allFood');
    const bookingCollection = client.db('savoryTavern').collection('bookings');
    
    // all food
    app.get('/allfood', async (req, res) => {
        const query = req.query
        const page = query.page
        const pageNumber = parseInt(page)
        const perPage = 9
        const skip = pageNumber * perPage

        const cursor = foodCollection.find().skip(skip).limit(perPage);
        const result = await cursor.toArray();
        const foodCount = await foodCollection.countDocuments();
        res.json({result, foodCount});

        app.get('/allfoods', async (req, res) => {
          const cursor = foodCollection.find();
          const result = await cursor.toArray();
          res.send(result);
      })

    })
    app.get('/allfoods/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await foodCollection.findOne(query);
      res.send(result);
    })

    app.get('/allfood/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await foodCollection.findOne(query);
        res.send(result);
    })
       app.post('/allfood', async (req, res) => {
            const newFood = req.body;
            console.log(newFood);
            const result = await foodCollection.insertOne(newFood);
            res.send(result);

        })
         app.put('/allfoods/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedFood = req.body;
            const allFood = {
                $set: {
                    Name: updatedFood.Name,
                    Category: updatedFood.Category,
                    Image: updatedFood.Image,
                    Origin: updatedFood.Origin,
                    Price: updatedFood.Price,
                    Quantity: updatedFood.Quantity,
                    AddedBy: updatedFood.AddedBy,
                    Description: updatedFood.Description,
                }
            }

            const result = await foodCollection.updateOne(filter, allFood, options);
            res.send(result);

        });
         

        // bookings CRUD


        app.get('/bookings', async(req, res) =>{
          console.log(req.query.email);
          let query = {};
          if (req.query?.email) {
            query = { email: req.query.email }
          }
          
            
          const result = await bookingCollection.find(query).toArray();  
           
               
          res.send(result); 
      });

        app.post('/bookings', async (req, res) => {
          const booking = req.body;
          console.log(booking);
          const result = await bookingCollection.insertOne(booking);
          res.send(result);

      })
      app.delete('/bookings/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await bookingCollection.deleteOne(query);
        res.send(result);
      })
     



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Savory server running')
  })
  app.listen(port, () => {
    console.log(`Savory tavern server running on port ${port}`)
  })  