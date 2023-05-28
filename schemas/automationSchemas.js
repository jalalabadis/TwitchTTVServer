const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
    Automation: {
        type: Boolean,
        required: true
    },
    display_name: {
        type: String,
        required: true
    },
    followerCount: {
        type: Number,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    profile_image_url: {
        type: String,
        required: true
    },
    SubDate: {
        type: Number,
        default: Date.now(),
        required: false
    },
    ExDate:{
        type: Number,
        default: Date.now()+30 * 24 * 60 * 60 * 1000,
        required: false
    },
    Subscription:[{
        type: mongoose.Types.ObjectId,
        ref: "User"
      }],
});

module.exports = automationSchema;