const express =require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const bookCollection = client.db('productdb').collection('book')
const userCollection = client.db('productdb').collection('users')

function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}
 async function run (){
    try{
        // app.put('/user/:email',async(req,res)=>{
        //     const email = req.params.email
        //     const user = req.body;
        //     const filter = { email:email } 
        //     const options = {upsert:true}
        //     const UpdateDoc = {
        //       $set:user
        //     }
        //     const result = await userCollection.UpdateDoc(filter,UpdateDoc,options)
        //     console.log(result);
      
        //     const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
        //       expiresIn:'1d'
        //     })
        //     res.send({result,token})
        //   })
  
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

        // seapick data load 
        app.get('/advertise',async(req,res)=>{
            const query = {}
            const homes = await homeCollection.find(query).toArray()
            res.send(homes)
        
        })
        // booking product 
        app.post('/book',verifyJWT,async(req,res)=>{
            const book = req.body
            const result = await bookCollection.insertOne(book)
            res.send(result);
        })
       
        // product findeone 
        app.get('/homes/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const products = await homeCollection.findOne(query);
            res.send(products);
        })
        
        // dashbord data load 
        app.get('/homes/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email}
            const homes = await homeCollection.findOne(query);
            res.send(homes);
        })
        app.get('/book', async (req, res) => {
            const query = { };
            const product = await productCollection.find(query).toArray();
            res.send(product);
        })
       

        app.delete('/homes/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id:ObjectId(id) };
            const result = await homeCollection.deleteOne(filter);
            res.send(result);
        })
        

        //  allseller er  data load 
        app.get('/homes', async (req, res) => {
            const query = {}
            const result = await homeCollection.findOne(query);
            res.send(result);
        })

        // verifay alluser er data load 

        app.put('/homes/:id',  async (req, res) => {
            const id = req.params.id;
            const filter = {_id:ObjectId(id) }
            const options = {upsert: true };
            const updatedDoc = {
                $set: {
                    role: ''
                }
            }
            const result = await homeCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        // jwt emplement 

       

        // myorders api get data 

        app.get('/homes', async(req,res)=>{
            const  query = {}
            const homes = await homeCollection.insertOne(query)
            res.send(homes)
        })

        // jwt token 

        app.get('/jwt', async(req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET)
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
        });

        // user  post 

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        app.put('/users/admin/:id',  async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        //  app put verifay email 
        app.put('/users/verifay', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role:users=true
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // all bayer 

        app.get('/allbayers',async(req,res)=>{
            const query = {}
            const user = await userCollection.find(query).toArray()
            res.send(user)
        })


        app.get('/users', async (req, res) => {
            const query = {};
            const users = await userCollection.find(query).toArray();
            res.send(users);
        });




 
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
// name