const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;
const jwt = require('jsonwebtoken');
const router = express.Router();
const userSchema = require('../schemas/userSchemas');
const User = mongoose.model("User", userSchema);
const authCheck = require('../middlewares/authCheck');

// Configure express-session middleware
router.use(session({
    secret: 'k9Kl0978s',
    resave: false,
    saveUninitialized: false
  }));

  // Set up Passport middleware
  router.use(passport.initialize());
  router.use(passport.session());

  router.get('/auth/twitch', (req, res, next)=>{
    console.log(process.env.TWITCH_CLIENT_ID+process.env.TWITCH_CLIENT_SECRET+`${req.protocol}://${req.get('host')}`)
    passport.use(new TwitchStrategy({
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: `http://${req.get('host')}/user/auth/twitch/callback`,
      scope: "user_read"
    }, function(accessToken, refreshToken, profile, done) {
      // Here, you can perform any necessary database operations to store the user's information
      // and call the 'done' function to continue with the authentication process
      done(null, { accessToken: accessToken, profile: profile });
    }));
   passport.authenticate('twitch')(req, res, next);
  });

    // Set up Passport serialization/deserialization functions
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

router.get('/auth/twitch/callback', passport.authenticate('twitch', { failureRedirect: '/login' }), function(req, res) {
  // Authentication successful, redirect to desired page
  res.redirect(`/user`);
});

router.get('/', async (req, res) => {
  
  try{
  const userData ={
    userID: req.user.profile.id,
    userName: req.user.profile.login,
    display_name: req.user.profile.display_name,
    type: req.user.profile.type,
    broadcaster_type: req.user.profile.broadcaster_type,
    view_count: req.user.profile.view_count,
    email: req.user.profile.email,
    Avatar: req.user.profile.profile_image_url,
    accessToken: req.user.accessToken
};
  const Users = await User.findOne({userID: req.user.profile.id});
    if(Users){
  const token = jwt.sign({
        userID: Users._id,
        accessToken: req.user.accessToken,
        userName: req.user.profile.display_name,
        email: req.user.profile.email,
        Avatar: req.user.profile.profile_image_url
  }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.redirect(`${process.env.EXPRESS_APP_CLIENT?process.env.EXPRESS_APP_CLIENT:''}/login?token=${token}`);
    }
  else{
  const newUser = new User(userData);
  await newUser.save()
.then((Users)=> {
const token = jwt.sign({
    userID: Users._id,
    accessToken: req.user.accessToken,
    userName: req.user.profile.display_name,
    email: req.user.profile.email,
    Avatar: req.user.profile.profile_image_url
}, process.env.JWT_SECRET, { expiresIn: '7d' });
res.redirect(`${process.env.EXPRESS_APP_CLIENT?process.env.EXPRESS_APP_CLIENT:''}/login?token=${token}`);
  //res.status(200).json(userData);
})
.catch(err=> res.status(500).send('Authorization failed!'));
}

}
catch{
res.redirect(`${process.env.EXPRESS_APP_CLIENT?process.env.EXPRESS_APP_CLIENT:''}`);  
}
});


router.post('/', authCheck, async (req, res)=>{
try{
  if(req.userID){
  res.status(200).send('Authorization Success!');
  }
  else{
    res.status(500).send('Authorization failed!');
  }
}
catch{
  res.status(500).send('Authorization failed!');
}
});


///user Data
router.post('/user-api', async (req, res)=>{
  try{
    const userData = await User.findOne({_id: req.body.providerId});
    
    if(userData){
    res.status(200).send(userData);
    }
    else{
      res.status(500).send('Authorization failed!');
    }
  }
  catch{
    res.status(500).send('Authorization failed!');
  }
  });
//Export
module.exports = router;