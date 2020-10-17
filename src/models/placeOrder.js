const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const foodSchema = new Schema({
  
  id: {
      type: String,
      required: true
  },
  sessionID: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('placeOrder', foodSchema);