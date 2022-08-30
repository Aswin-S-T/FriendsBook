const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const auth = require("../utils/utils");
const formidable = require("formidable");
const { cloudinary } = require("../utils/helpers");
const Post = require("../models/postModel");
const mongoose = require(('mongoose'))
const ObjectId = mongoose.Types.ObjectId;

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
      expiresIn: "12h",
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
          expiresIn: "12h",
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
    console.log('UPLOADED RESONSE----------',uploadResponse)
   
    res.json({ msg: "uploaded successfully" });
    // console.log(fileStr);
  } catch (err) {
    console.error("Error ", err);
    res.status(500).json({ err: "Something went wrong" });
  }
})

userRouter.post('/add-my-post',auth,async(req,res)=>{
  let userData = req.user
  let response = {}
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "cloudinary_react",
      public_id: Date.now(),
    });
    console.log("uploaded response : ", uploadResponse);
    let postData = {
      userId: userData.user_id,
      caption: req.body.caption,
      description: req.body.description,
      image: uploadResponse.url,
    };
    let post = await Post.create(postData).then((result) => {
      // console.log("RSULT-----------", result);
    });
    res.status = 200
    response.success = true
    res.send(response)
   
  } catch (err) {
    console.error("Error ", err);
    res.status(500).json({ err: "Something went wrong" });
  }
})

userRouter.get('/get-all-post',async(req,res)=>{
  let post = await Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: ObjectId("_id"),
        as: "post",
      },
    },
  ]);
  let feeds = await Post.find({}).then(async(result)=>{
  
    await User.find({}).then((response)=>{
      console.log('last result : ',response)
    })
  })
  let user = await User.find({})
  // console.log(user)

  // Temparory code
  await Post.find({}).then((result)=>{
    console.log('post-----',result.data)
  })
  // End temp code
  res.send(post)
})

userRouter.get('/get-post',async(req,res)=>{
  const { resources } = await cloudinary.search.expression(
    "folder:cloudinary_react"
  ).sort_by('public_id','desc')
  .max_results(10).execute();
  const publicIds = resources.map((file)=>file.public_id)
  // new code
  let postss = await Post.find({})
  console.log('posts-----', postss)
  // end new codes
  res.send(postss);
})

userRouter.get('/get-my-post/:id',async(req,res)=>{
  let userId = req.params.id
  let response = {}
  try {
    let user = await User.find({ _id: userId }).sort({ timestamps: -1 });
    // console.log('USER : ',user)
    let myPost = await Post.find({userId : userId})
    response.success = true
    response.status = 200
    response.data = myPost
    response.username = user[0].username
    res.send(response)
  } catch (error) {
    response.status = 500
    response.success = false
    response.data = error
  }
  
})

userRouter.get('/get-all-users',auth,async(req,res)=>{
  let userData = req.user
  let response = {}
  let users = await User.find({})
  let userArr = []
  console.log(users)
  for (let i=0;i<users.length;i++){
    const e = users[i]
    if(e._id == userData.user_id){
      continue
    }
    userArr.push(e)
  }
  response.success = true
  response.status = 200
  response.data = userArr
  res.send(response);
})

userRouter.post('/add-comment',auth,(req,res)=>{
  let userData = req.user
  let postId = req.body.postId
  console.log(userData)
  res.send('hello')
})

userRouter.delete('/delete-post/:postId',async(req,res)=>{
  console.log('DELETE POST CALLED=======')
  let deletedPost = await Post.deleteOne({_id : req.params.postId})
  let response = {}
  if(deletedPost.acknowledged == true){
    response.status = 200
    response.message = "succcess"
  }
  res.send(response)
})

userRouter.post('/give-like/:postId',auth,async(req,res)=>{
  let user = req.user
  let likeCount;
  let post = await Post.find({ _id: req.params.postId }).then((result) => {
    likeCount = result[0].likeCount;
    console.log(result);
  });
  let updatePost = await Post.update({ _id: req.params.postId }, { $push: { like: user } ,likeCount: likeCount + 1});
 
  res.send(updatePost);
})

userRouter.get('/user/:userId',)

module.exports = userRouter;
