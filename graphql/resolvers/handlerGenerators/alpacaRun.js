const moment = require('moment')
const { map } = require('lodash')
const AlpacaRun = require('../../../models/alpaca_run')
const NopacaRun = require('../../../models/nopaca_run')
const RunArchive = require('../../../models/run_score_archives')
const { decrypt } = require('../../../utils/crypto')

async function getRunLeaderboards() {
  try {
    const totalLeader = await AlpacaRun.find({ totalScore: { $gt: 0 } }).sort({ totalScore: -1 }).limit(500)
    const singleRoundLeader = await AlpacaRun.find({ highScore: { $gt: 0 } }).sort({ highScore: -1 }).limit(500)

    return {
      singleRoundLeader,
      totalLeader
    }
  }
  catch(err) {
    throw err
  }
}

async function getRunById(args) {
  try {
    const { id } = args;
    const data = await AlpacaRun.findOne({ tokenId: id })

    return data
  }
  catch(err) {
    throw err
  }
}

async function updateRunScore(args) {
  try {
    const { code } = args; //retrieve values from arguments

    const decoded = await decrypt(code)
    const { tokenId, score } = JSON.parse(decoded)

    if (score > 2500) return "Don't Fucking Cheat"

    const { _doc } = await AlpacaRun.findOne({ tokenId })

    const updatedScore= {
      ..._doc,
      totalScore: _doc.totalScore + score,
      highScore: score > _doc.highScore ? score : _doc.highScore,
      latestScore: score,
      updateDate: moment()
    }

    const alpacaRun = await AlpacaRun.findOneAndUpdate( 
      { tokenId },
      { ...updatedScore },
      {new: true}
    )

    return 'Updated'
  }
  catch(err) {
    throw err
  }
}

async function resetRun() {
  try {
    const alpacaTotalRank = await AlpacaRun.find({ totalScore: { $gt: 0 } }).sort({ totalScore: -1 }).limit(3)
    const alpacaSingleRank = await AlpacaRun.find({ highScore: { $gt: 0 } }).sort({ highScore: -1 }).limit(3)
    const nopacaTotalRank = await NopacaRun.find({ totalScore: { $gt: 0 } }).sort({ totalScore: -1 }).limit(3)
    const nopacaSingleRank = await NopacaRun.find({ highScore: { $gt: 0 } }).sort({ highScore: -1 }).limit(3)

    const archive = new RunArchive({
      alpacaTotalRank: map(alpacaTotalRank, ({ tokenId, totalScore }, index) => ({ tokenId, score: totalScore, rank: index + 1 })),
      alpacaSingleRank: map(alpacaSingleRank, ({ tokenId, highScore }, index) => ({ tokenId, score: highScore, rank: index + 1 })),
      nopacaTotalRank: map(nopacaTotalRank, ({ discord, totalScore }, index) => ({ discord, score: totalScore, rank: index + 1 })),
      nopacaSingleRank: map(nopacaSingleRank, ({ discord, highScore }, index) => ({ discord, score: highScore, rank: index + 1 })),
    }, (err) => { if (err) throw err })

    await archive.save()

    await AlpacaRun.updateMany(
      {},
      { 
        $set: {
          'totalScore': 0,
          'highScore': 0
        }
      }
    )
    
    await NopacaRun.updateMany(
      {},
      { 
        $set: {
          'totalScore': 0,
          'highScore': 0
        }
      }
    )

    return 'Updated'
  }
  catch(err) {
    throw err
  }
}

module.exports = {
  getRunLeaderboards,
  getRunById,
  updateRunScore,
  resetRun
}