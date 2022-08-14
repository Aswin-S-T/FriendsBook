const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const auth = require("../utils/utils");
const formidable = require("formidable");
const { cloudinary } = require("../utils/helpers");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("USER ROUTUER CALLED");
});

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username && email && password)) {
    res.status(400).send("All input is required");
  }
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res.status(409).send("User Already Exist. Please Login");
  }
  encryptedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email: email.toLowerCase(),
    password: encryptedPassword,
  });

  const token = jwt.sign(
    { user_id: user._id, email },
    process.env.TOKEN_KEY || "something secret",
    {
      expiresIn: "2h",
    }
  );
  user.token = token;
  res.status(201).json(user);
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY || "something secret",
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      res.status(200).json(user);
    }
    res.send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

userRouter.get("/welcome",auth,(req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

userRouter.post('/add-post',async(req,res)=>{
  const userData = req.user
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "cloudinary_react",
      public_id: Date.now(),
    });
   
    res.json({ msg: "uploaded successfully" });
    // console.log(fileStr);
  } catch (err) {
    console.error("Error ", err);
    res.status(500).json({ err: "Something went wrong" });
  }
})

userRouter.get('/get-post',async(req,res)=>{
  const { resources } = await cloudinary.search.expression(
    "folder:cloudinary_react"
  ).sort_by('public_id','desc')
  .max_results(10).execute();
  const publicIds = resources.map((file)=>file.public_id)
  res.send(publicIds)
})

module.exports = userRouter;
