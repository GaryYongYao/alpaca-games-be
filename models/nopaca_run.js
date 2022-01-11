const mongoose = require('mongoose')
const { Schema } = mongoose

const NopacaRunSchema = new Schema({
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
  records: [{
    type: String,
    required: true
  }],
  status: String,
  reason: String,
  updateDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model('NopacaRun', NopacaRunSchema)
