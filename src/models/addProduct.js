const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const foodSchema = new Schema({
  unique_id: Number,

  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  restaurant: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Food', foodSchema);