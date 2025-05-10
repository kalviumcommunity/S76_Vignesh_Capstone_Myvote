const express = require('express');
const router = express.Router();
const User = require('../model/adminSchema');
const { param } = require('./adminRoutes');
const Election = require('../model/electionSchema');


router.get('/dash-user',async(req,res)=>{
    const { email } = req.query;

    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({ success: false, message: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        console.log(error);
    }
})

router.get('/election-count', async(req,res)=>{
    try{
        const today = new Date();
        const count = await Election.countDocuments({ electionDate: { $gt: today } });
        res.send(count);
    }catch(error){
        console.log(error);
    }
})

module.exports = router