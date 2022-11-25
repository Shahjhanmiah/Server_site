const express =require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT||5000
 
const app = express()
 
// Middler ware
 
app.use(cors());
app.use(express.json())
 
// database theke data load  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ga6ydds.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const homeCollection = client.db('productdb').collection('homes')
const productCollection = client.db('productdb').collection('products')




 async function run (){
    try{
  
        app.get('/homes',async(req,res)=>{
            const query = {} ;
            const result = await homeCollection.find(query).toArray()
            res.send(result)
        })
         // add a post 
         app.post('/products', async(req,res)=>{
            const products = req.body
            const result = await productCollection.insertOne(products)
            res.send(result);
        })
        // product findeone 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await productCollection.findOne(query);
            res.send(products);
        })



 
    }

    finally{

    }
 }
 run().catch(error=>console.log(error))

 
app.get('/',async(req,res)=>{
    res.send('product port running is server')
})
 
 
app.listen(port,()=>console.log`product is running is server ${port}`)
 
 
 
// database user name :productdb
// password :aj9FeMoDMMay96nV
 
 
 
// productdb
// homes