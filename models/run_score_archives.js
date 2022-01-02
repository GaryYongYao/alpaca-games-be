const mongoose = require('mongoose')
const { Schema } = mongoose

const RunArchiveSchema = new Schema({
  alpacaTotalRank: [{
    tokenId: String,
    score: Number,
    rank: Number
  }],
  alpacaSingleRank: [{
    tokenId: String,
    score: Number,
    rank: Number
  }],
  nopacaTotalRank: [{
    discord: String,
    score: Number,
    rank: Number
  }],
  nopacaSingleRank: [{
    discord: String,
    score: Number,
    rank: Number
  }],
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('RunArchive', RunArchiveSchema)
