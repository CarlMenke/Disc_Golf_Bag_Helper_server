
const User = require('../models/user')
const Post = require('../models/post')
const PostIndex = require('../models/postindex')
const bcrypt = require('bcrypt');



// used to create a new user

const createUser = async (req,res) =>{
    try{
        const userName = req.params.userName;  
        let profilePic = req.body.profilePic;

        function isImage(url) {
            return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        }

        if(!isImage(profilePic)){
            profilePic = 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
        }

        const password = await bcrypt.hash(req.params.password,10);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        const user =  new User({
            userName : userName,
            password : password,
            profilePic : profilePic
        })
        await user.save();

        return res.status(200).json({user}).headers

    }catch(error) {
        return res.status(500).json({error: error.message})
    }
}

const getPostByTopic = async (req,res) =>{
    try{
        const response = await Post.find({topic_id: req.params.topic_id})

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

        return res.status(200).json(response)
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

const getPostByUser = async (req,res) =>{
    try{
        const response = await Post.find({user_id: req.params.user_id})

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

        return res.status(200).json(response)
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

const checkUser = async (req, res) =>{
    try{
        const userName  = req.params.userName
        const user = await User.find({userName:userName})

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

        if (user.length < 1){
            res.status(200).send({exists: false})
        }else if(await bcrypt.compare(req.params.password, user[0].password)){
            res.status(200).send({exists: true, user: user})
        }else{
            res.status(200).send('Password Incorrect')
        }
    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const getAllUsers = async (req, res) =>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        const users = await User.find({})

        return res.status(200).send(users)
    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const getUser = async (req,res)=>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        const user = await User.find({_id:`${req.params.id}`})

        return res.status(200).send(user)
    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const deleteUser = async (req, res )=>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        const deletedPost = await Post.deleteMany({user_id:`${req.params.id}`})

        await User.deleteOne({_id:`${req.params.id}`})

        return res.status(200).send('Your account has been succesfully deleted.')
    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const updateUser = async (req, res )=>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        await User.updateOne({_id:`${req.params.id}`},{userName:`${req.params.newName}`})

        return res.status(200).send(`Your User Name has been succesfully updated to ${req.params.newName}.`)
    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const getRecentPosts = async(req,res) =>{

    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        const response = await Post.find({});
        
        response.sort((a,b) =>{
            return b.index - a.index
        })

        res.status(200).send(response)
    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const createPost = async (req,res) =>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        const content = req.params.content;
        const user_id = req.params.user_id;
        const topic_id = req.params.topic_id;

        let currIndex = await PostIndex.find({})
        let  newIndex = Number(currIndex[0].index) + 1
        const response = await PostIndex.updateOne({index:currIndex[0].index}, {$set: {index: newIndex}})

        const post  = await new Post({
            topic_id : topic_id,
            user_id : user_id,
            content : content,
            index : newIndex
        })
        await post.save();

        return res.status(200).json({post})

    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const getPostIndex = async (req,res) =>{
     try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        const response = await PostIndex.find({})
        res.status(200).send(response)
    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const initalizeIndex = async(req,res) =>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        const postIndex = await new PostIndex({index:0})

        await postIndex.save()

        res.status(200).send(postIndex)

    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const resetPostIndex = async(req,res) =>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        const response = await PostIndex.updateOne({}, {index: 0})

        res.status(200).send(response[0].index)
    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const wipePosts = async(req,res) =>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        const response = await Post.deleteMany({})

        res.status(200).send(response)
    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const deleteUserPosts = async (req, res )=>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        
        await Post.deleteMany({user_id:`${req.params.id}`})

        return res.status(200).send('All Posts successfully deleted')
    }catch(error){
        res.status(500).send({error:error.message})
    }
}

const addDiscToUser = async (req,res) =>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

        const newDisc = req.body.disc
        let newDiscArray = [];

        const user = await User.find({_id:`${req.params.id}`})
        newDiscArray = [...user[0].userDiscs, newDisc]

        const response = await User.updateOne({_id:`${req.params.id}`}, { $set: {'userDiscs': newDiscArray}})

        return res.status(200).send(response)

    }catch(error){
        res.status(500).json({error:error.message})
    }
}

const removeDiscFromUser = async (req,res) =>{
    try{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

        const discNameSlug = req.params.discNameSlug;

        const user = await User.find({_id:`${req.params.user_id}`})

        let userDiscs = user[0].userDiscs

        const discRemove = userDiscs.filter((disc) => {
            return disc.name_slug === discNameSlug
        })

        const index = userDiscs.indexOf(discRemove[0])

        userDiscs.splice(index,1)

        await User.updateOne({_id:`${req.params.user_id}`}, { $set: {'userDiscs': userDiscs}})

        return res.status(200).send(userDiscs)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}


//exports  controller funcitons
module.exports = {
    createUser,
    getAllUsers,
    deleteUser,
    checkUser,
    updateUser,
    createPost,
    getUser,
    getRecentPosts,
    getPostIndex,
    resetPostIndex,
    wipePosts,
    deleteUserPosts,
    getPostByTopic,
    getPostByUser,
    addDiscToUser,
    initalizeIndex,
    removeDiscFromUser,
}
