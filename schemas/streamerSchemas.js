const mongoose = require('mongoose');

const steamerSchema = new mongoose.Schema({
    broadcaster_type: {
      type: String,
      required: false
    },
    created_at: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
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
    login: {
        type: String,
        required: true
    },
    offline_image_url: {
        type: String,
        required: false
    },
    profile_image_url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false
    },
    view_count: {
        type: String,
        required: false
    },
    SearchCount: {
        type: Number,
        required: false
    },
    date: {
        type: Number,
        default: Date.now(),
        required: false
    },
    Subscription:[{
        type: mongoose.Types.ObjectId,
        ref: "User"
      }],
});

module.exports = steamerSchema;