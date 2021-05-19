const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  price: { type: Number, required: true },
  shortDesc: { type: String, required: true },
  longDesc: { type: String, required: true },
  imgFile: { type: String, required: true },
});

module.exports = mongoose.model('Products', productSchema);
