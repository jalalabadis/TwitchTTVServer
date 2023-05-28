const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const streamerSchema = require('../schemas/streamerSchemas');
const authCheck = require('../middlewares/authCheck');
const Automation = require('../middlewares/Automation');
const Streamer = mongoose.model("streamer", streamerSchema);


///Streamer info
router.post('/user-info', authCheck, async (req, res)=>{
  try {
    const username = req.body.username;
    const clientId = process.env.TWITCH_CLIENT_ID;
    const accessToken = req.accessToken;

    const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const user = response.data.data[0];

    const followsResponse = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${user.id}`, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    user.followerCount = followsResponse.data.total;

    const streamer = await Streamer.findOne({id: user.id});

    if (streamer) {
      await Streamer.updateOne({ id: user.id }, { $inc: { SearchCount: 1 } }).exec();
     
    } else {
  user.SearchCount = 0;
  const newStreamer = new Streamer(user);
  await newStreamer.save();
    }

    res.send(user);

  } catch (err) {
    res.status(500).send('Error fetching data');
  }
});



///All data
router.post('/', authCheck, async (req, res)=>{
  const StreamerData = await Streamer.find();
  if(StreamerData){
      res.status(200).send(StreamerData);
  }
  else{
      res.status(404).send('No data found');
  }
});
module.exports = router;
