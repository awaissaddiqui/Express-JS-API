const { regValidation } = require('../validation');
const User = require('../models/User')
const userRoutes = require("express").Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken= require("./verifyToken")
userRoutes.get("/register",verifyToken, (req, res)=>{
    res.send("we are at register : GET ROUTE")
    
})
userRoutes.post("/register", async(req, res)=>{

    const {name, email,password , address}= req.body;
    const {error} = regValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const findUser=await User.findOne({email:req.body.email})
    if(findUser) return res.status(400).send("Email already exists")

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)
     
    
    const user = new User({
        name,
        email,
        password: hash,
        address
    })

    try{
        const savedUser= await user.save();
        res.send(savedUser)
    }
    catch{
        res.status(400).send("error")
    }
})
userRoutes.patch("/register", (req, res)=>{

})
userRoutes.delete("/register", verifyToken,(req, res)=>{

})
userRoutes.get("/login", (req, res)=>{

})
userRoutes.post("/login", async(req, res)=>{
        
        const {email, password} = req.body;

       const user = await User.findOne({email:email})
       if(!user) return res.status(400).send("You don't have an account Please Sign Up!!")

       const compare = await bcrypt.compare(password, user.password)
       if(!compare) return res.status(400).send("password is incorrect!!")

        const token =jwt.sign({email: user.email}, process.env.DB_USERSECRET)
        res.header('token', token).send(token)

        //  console.log(process.env.DB_USERNAME2)
        // res.status(200).send("Logged In Successfully !!! ")
})
userRoutes.delete("/login", (req, res)=>{

})
userRoutes.patch("/login", (req, res)=>{

})

module.exports = userRoutes;