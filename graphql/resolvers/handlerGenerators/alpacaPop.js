const moment = require('moment')
const AlpacaPop = require('../../../models/alpaca_pop')
const { decrypt } = require('../../../utils/crypto')

async function getPopLeaderboards() {
  try {
    const data = await AlpacaPop.find({ totalScore: { $gt: 0 } }).sort({ totalScore: -1 }).limit(200)

    return data
  }
  catch(err) {
    throw err
  }
}

async function getPopById(args) {
  try {
    const { id } = args;
    const data = await AlpacaPop.findOne({ tokenId: id })

    return data
  }
  catch(err) {
    throw err
  }
}

async function updatePopScore(args) {
  try {
    const { code } = args; //retrieve values from arguments

    const decoded = await decrypt(code)
    const { tokenId, score } = JSON.parse(decoded)

    const { _doc } = await AlpacaPop.findOne({ tokenId })

    const updatedScore= {
      ..._doc,
      totalScore: _doc.totalScore + score,
      latestScore: score,
      updateDate: moment()
    }

    const alpacaPop = await AlpacaPop.findOneAndUpdate( 
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

async function resetPop(args) {
  try {
    const { code } = args; 
    if (!code || code !== 'Cass525Y') return 'Done'

    await AlpacaPop.updateMany(
      {},
      { $set: { 'totalScore': 0 }}
    )

    return 'Updated'
  }
  catch(err) {
    throw err
  }
}

module.exports = {
  getPopLeaderboards,
  getPopById,
  updatePopScore,
  resetPop
}