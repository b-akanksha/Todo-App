const mongoose = require('mongoose');
const schema = mongoose.Schema;



const Item = new schema({
    item : String,
    user: String
});

const itemModel = mongoose.model("TodoApp", Item);

module.exports = itemModel;