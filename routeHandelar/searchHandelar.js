const express = require('express');
const router = express.Router();
const axios = require('axios');
const authCheck = require('../middlewares/authCheck');

// Streamer info
router.post('/', authCheck, async (req, res) => {
  const clientId = 'vnx6pr88umizlv8sdbogcqv9y6g4kv';
  const accessToken = req.accessToken;

  try {
    // Search for streamers based on the provided query
    const searchResponse = await axios.get('https://api.twitch.tv/helix/search/channels', {
      params: {
        query: req.body.skeyword,
      },
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

  

    res.status(200).send(searchResponse.data);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
