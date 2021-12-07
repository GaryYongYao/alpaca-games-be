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

module.exports = {
  getPopLeaderboards,
  updatePopScore,
}