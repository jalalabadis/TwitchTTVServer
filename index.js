const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var cors = require('cors');
const userHandelar = require('./routeHandelar/userHandelar');
const streamerHandelar = require('./routeHandelar/streamerHandelar');
const subscribeHandelar = require('./routeHandelar/subscribeHandelar');

  
//App initialization
const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

///DataBase Connect
mongoose.connect(process.env.EXPRESS_APP_DATABASE)
.then(()=> console.log('Databse connect successful'))
.catch(err => console.log(err));


//App Routes
app.use('/user', userHandelar);
app.use('/streamer', streamerHandelar);
app.use('/subscribe', subscribeHandelar);
app.get('*', (req, res) => {res.sendFile(path.join(__dirname, 'build', 'index.html'));});

////listen server
app.listen(PORT, ()=>{
    console.log('Server run port '+PORT);
});