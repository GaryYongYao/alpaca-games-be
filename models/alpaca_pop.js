const mongoose = require('mongoose')
const { Schema } = mongoose

const AlpacaPopSchema = new Schema({
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

module.exports = mongoose.model('AlpacaPop', AlpacaPopSchema)
