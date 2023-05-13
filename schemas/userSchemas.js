const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: {
      type: String,
      required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    display_name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false
    },
    broadcaster_type: {
        type: String,
        required: false
    },
    view_count: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    Avatar: {
        type: String,
        required: true
    }
});

module.exports = userSchema;