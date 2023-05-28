const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authCheck = require('../middlewares/authCheck');
const streamerSchema = require('../schemas/streamerSchemas');
const Streamer = mongoose.model("streamer", streamerSchema);
const automationSchema = require('../schemas/automationSchemas');
const AutomationData = mongoose.model("Automation", automationSchema);


///Validate remove (unsubscribe)
router.post('/', authCheck, async (req, res)=>{
    try{
    await Streamer.updateOne({id: req.body.strmearID}, {
        $pull: {
          Subscription: req.userID
        }});
    await AutomationData.deleteOne({_id: req.body.automotionID})
         .then(result=>res.status(200).send(result))
         .catch(err=>{res.status(500).send(err); console.log(err)});
    }
  catch(err){
         res.status(500).send(err);
         console.log(err)
       }});
  

module.exports = router;