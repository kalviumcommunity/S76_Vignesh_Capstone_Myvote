const express = require('express');
const router = express.Router();
const User = require('../model/adminSchema');
const { param } = require('./adminRoutes');


router.get('/dash-user',async(req,res)=>{
    const { email } = req.query;

    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({ success: false, message: 'User not found' });
        }
        // res.json({ success: true, user });
        res.send(user);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router