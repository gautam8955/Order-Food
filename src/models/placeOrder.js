//Model of placed orders by customers and restaurant uses to fetch the details of placed orders.

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
  },
  restaurant: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('placeOrder', foodSchema);