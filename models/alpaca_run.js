const mongoose = require('mongoose')
const { Schema } = mongoose

const AlpacaRunSchema = new Schema({
  tokenId: {
    type: String,
    unique : true,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  pastMonthScore: {
    type: Number,
    required: true
  },
  latestScore: {
    type: Number,
    required: true
  },
  image: String,
  updateDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model('AlpacaRun', AlpacaRunSchema)
