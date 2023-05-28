const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authCheck = require('../middlewares/authCheck');
const Automation = require('../middlewares/Automation');
const streamerSchema = require('../schemas/streamerSchemas');
const Streamer = mongoose.model("streamer", streamerSchema);
const automationSchema = require('../schemas/automationSchemas');
const AutomationData = mongoose.model("Automation", automationSchema);


///Validate Add (subscribe)
router.post('/', Automation, authCheck, async (req, res)=>{
    try{
      if(req.status){
        await Streamer.updateOne({id: req.body.StemarID}, {
          $push: {
            Subscription: req.userID
          } 
       });

       const AutomationDatas = await AutomationData.findOne({Subscription: req.userID, id: req.body.StemarID});

       if (AutomationDatas) {
         await AutomationData.updateOne({});
         res.status(200).send(AutomationDatas);
        }
        else{
       await new AutomationData({
        Automation: true,
        display_name: req.body.channel,
        followerCount: req.body.followerCount,
        id: req.body.StemarID,
        profile_image_url: req.body.profile_image_url,
        Subscription: req.userID
       }).save()
       .then(result=>res.status(200).send(result))
       .catch(err=>{res.status(500).send(err);});
      }
    }
    else{
  const AutomationDatas = await AutomationData.findOne({Subscription: req.userID, id: req.body.StemarID});
  if(AutomationDatas){
    res.status(200).send(AutomationDatas);
  }
  else{
    res.status(500).send(err);
  }
      }
    }
  catch(err){
         res.status(500).send("err");
       }
  });
  

  ///User Subscription (Automation) data
router.post('/user-subscription', authCheck, async (req, res)=>{
  const AutomationDatas = await AutomationData.find({Subscription: req.userID});
  if(AutomationDatas){
      res.status(200).send(AutomationDatas);
  }
  else{
      res.status(404).send('No data found');
  }
});

  ///All  subscription (Automation)  data
  router.post('/all-subscription', authCheck, async (req, res)=>{
    const AutomationDatas = await AutomationData.find().populate('Subscription');
    if(AutomationDatas){
        res.status(200).send(AutomationDatas);
    }
    else{
        res.status(404).send('No data found');
    }
  });

module.exports = router;