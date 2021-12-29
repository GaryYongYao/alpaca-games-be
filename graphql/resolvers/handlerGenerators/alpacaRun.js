const moment = require('moment')
const AlpacaRun = require('../../../models/alpaca_run')
const { decrypt } = require('../../../utils/crypto')

async function getRunLeaderboards() {
  try {
    const data = await AlpacaRun.find({ totalScore: { $gt: 0 } }).sort({ totalScore: -1 }).limit(200)

    return data
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

module.exports = {
  getRunLeaderboards,
  getRunById,
  updateRunScore,
}