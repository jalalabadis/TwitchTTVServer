const jwt = require('jsonwebtoken');
const axios = require('axios');

const authCheck = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const { userID, accessToken, refreshToken, userName, email, Avatar } = decoded;

    // Make a request to Twitch API to refresh the access token
    const refreshResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
      },
    });

    const newAccessToken = refreshResponse.data.access_token;

    req.userID = userID;
    req.accessToken = newAccessToken;
    req.userName = userName;
    req.email = email;
    req.Avatar = Avatar;

    next();
  } catch (err) {
    //console.log(err);
    next();
  }
};

module.exports = authCheck;