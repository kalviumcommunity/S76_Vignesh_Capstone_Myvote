const express = require('express');
const router = express.Router();
const Election = require('../model/voteSchema');

router.get('/voter',async(req,res)=>{
    const {voterId} = req.body;
    try {
        const voter = await Election.findOne({voterId});
        if(!voter){
            res.status(404).json({ success: false, message: 'Voter not found' });
        }
        res.json({ success: true, voter });
        res.send(voter);
    } catch (error) {
        console.log(error);
    }
})



module.exports = router