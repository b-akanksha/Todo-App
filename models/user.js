const mongoose = require('mongoose');
const schema = mongoose.Schema;

const User = new schema({
    email:String,
    name: String,
    password: String
});

const userModel = mongoose.model("user", User);

module.exports = userModel;