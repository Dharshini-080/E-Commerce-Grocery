const express=require("express")
const cors=require("cors")
const mongoose =require("mongoose")
const dotenv = require("dotenv").config()

const app=express()
app.use(cors())
app.use(express.json({limit: "10mb"}))

const PORT=process.env.PORT || 8080
//mongo con


mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URL).
then(()=>console.log("Connect to database"))
.catch((err)=>console.log(err))



//schema
const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    confirmpassword: String,
    image: String,
})
//
const userModel = mongoose.model("user",userSchema)

//api
app.get("/",(req,res)=>{
    res.send("Server is running")
})

//signup
app.post("/signup", async (req, res) => {
    console.log(req.body);
    const { email } = req.body;
  
    try {
      const existingUser = await userModel.findOne({ email: email });
  
      if (existingUser) {
        res.json({ message: "Email id is already registered" ,alert:false});
      } else {
        const newUser = new userModel(req.body);
        const savedUser = await newUser.save();
        res.json({ message: "Successfully signed up", user: savedUser ,alert:true});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const existingUser = await userModel.findOne({ email: email });

      if (existingUser) {
          // Compare the provided password with the hashed password stored in the database
          if (password === existingUser.password) {
              const dataSend = {
                  _id: existingUser._id,
                  firstName: existingUser.firstName,
                  lastName: existingUser.lastName,
                  email: existingUser.email,
                  image: existingUser.image,
              };
              console.log(dataSend);
              res.json({ message: "Login is successful", alert: true, data: dataSend });
          } else {
              // If passwords don't match, send error response
              res.json({ message: "Incorrect password", alert: false });
          }
      } else {
          res.json({ message: "Email is not registered, Please sign up", alert: false });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

   
  //product session

  const schemaProduct = mongoose.Schema({
    name: String,
    category: String,
    image: String,
    price: String,
    description: String,
  });
  const productModel = mongoose.model("product", schemaProduct)


  //save product in db
  //api

  app.post("/uploadProduct",async(req,res)=>{
    console.log(req.body)
    const data=await productModel(req.body)
    const datasave=await data.save()
    res.send({message: "Upload successfully"})
  })
 
  //
  app.get("/product",async(req,res)=>{
    const data=await productModel.find({})
    res.send((JSON.stringify(data)))
  })

app.listen(PORT,()=>console.log("server is running at port: "+PORT))