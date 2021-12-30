const moment = require('moment')
const AlpacaRun = require('../../../models/alpaca_run')
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
    await AlpacaRun.updateMany(
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