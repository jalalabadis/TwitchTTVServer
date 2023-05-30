const axios = require('axios');
const authCheck = require('./authCheck');


const activeAutm = (req, res, next) => {
  authCheck(req, res, () => {
  const ClintID = process.env.TWITCH_CLIENT_ID;
  const channelID = req.body.StemarID;
  const accessToken = req.accessToken;

  try {
    axios.post(`https://api.twitch.tv/helix/subscriptions`, {
      broadcaster_id: channelID,
      tier: '1000',
    }, {
      headers: {
        'Client-ID': ClintID,
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then(result=>{
      req.status = true;
     next();
    })
    .catch(err=>{
      req.status = true;
      next();
    });    
  } catch (error) {
    req.status = false;
    next();
  }
})
};

module.exports = activeAutm;
