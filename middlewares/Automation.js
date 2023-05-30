const axios = require('axios');
const mongoose = require('mongoose');
const userSchema = require('../schemas/userSchemas');
const User = mongoose.model("User", userSchema);
const automationSchema = require('../schemas/automationSchemas');
const AutomationData = mongoose.model("Automation", automationSchema);


const Automation = async (req, res, next)=>{
    const currentTime = new Date();
    try{
       
////Find all Expire Prime
const automationsToUpdate = await AutomationData.find({ ExDate: { $lt: currentTime } }).exec();
///Start reSubscripton all Expire Prime
for (const automation of automationsToUpdate) {
    // Find the corresponding user
    const user = await User.findById(automation.Subscription).exec();

 // Make a request to Twitch API to refresh the access token
const refreshResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: user.refreshToken,
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
        },
      });

/////Subscribe Strmear
   axios.post(`https://api.twitch.tv/helix/subscriptions`, {
      broadcaster_id:automation.channelid,
      tier: '1000',
    }, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${refreshResponse.data.access_token}`,
      },
    })
    .then(async result=>{
        automation.Automation = true;
        automation.ExDate = Date.now()+30 * 24 * 60 * 60 * 1000;
        // Save the updated automation
        await automation.save();
    })
    .catch(async err=>{
        automation.Automation = false;
        // Save the updated automation
        await automation.save();
    });    
    console.log(refreshResponse.data.access_token)
    console.log(automation.channelid)

}
}
catch(err) {
        console.log('Failed to connect to MongoDB:', err);
      }
};

module.exports = Automation;