const Worker = require('../models/worker')

exports.getAllUser = async(req,res)=>{
    try {
        const data = await Worker.find()
        res.json(data)
    } catch (error) {
        res.status(500).json({massege:error.massege})
    }
}
exports.createUser = async(req,res)=>{
    try {
        const newUser = await Worker.create(req.body)
        res.json(newUser)
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyValue)[0];
            const errorMessage = `${field.charAt(0).toUpperCase() + field.slice(1)} already taken`;
            res.status(400).send({ message: errorMessage });
          } else {
            // Other errors
            res.status(500).send({ message: error.code});
          }        
    }
}
exports.getUserById = async(req,res)=>{
    try {
        const userID = req.body.id;
        const foundUsers = await User.find({id:userID})
        if(foundUsers == 0){
            res.send('User is not Found!!!')
        }else{
            res.json(foundUsers)
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getWorkerInfo = async(req,res)=>{
    try {
        const workerID = req.body.id;
        const foundWorker = await Worker.find({id:workerID})
        if(foundWorker == 0){
            res.send('User is not Found!!!')
        }else{
            res.json(foundWorker.abilities)
        }
    } catch (error) {
        res.status(500).json({massege:error.massege})
    }
}
exports.getUserByUsername = async(req,res)=>{
    try {
        const userName=req.query.username 
        foundUser = await User.find({username: userName})
        if(foundUser == 0){
            res.send('User is not found from api!!!', )

        }else{
            res.json(foundUser)
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.deleteUserById = async(req,res)=>{
    try {
        const userId = req.body.id;
        const deleted = await User.deleteMany({id:userId})
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.update = async(req, res)=>{
    try {
        const updates = Object.keys(req.body)
        const allowUpdates = ['name', 'email', 'username', 'password']
        const isValidOperation = updates.every((update)=>allowUpdates.includes(update))

        if(!isValidOperation){
            return res.status(400).send({error:'Invalid Updates!'})
        }
        try {
            const user = await User.findById(req.params.id)
            updates.forEach((update)=>user[update] = req.body[update])
            //await user.save();
           
            res.json(user);

        } catch (err) {
        res.status(500).json({ message: err.message });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
exports.login = async(req, res)=>{
    try {   
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}