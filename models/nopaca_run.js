const mongoose = require('mongoose')
const { Schema } = mongoose

const NopacaPopSchema = new Schema({
  discord: {
    type: String,
    unique : true,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  highScore: {
    type: Number,
    required: true
  },
  latestScore: {
    type: Number,
    required: true
  },
  updateDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model('NopacaPop', NopacaPopSchema)
