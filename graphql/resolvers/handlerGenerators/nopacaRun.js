const moment = require('moment')
const NopacaRun = require('../../../models/nopaca_run')
const { decrypt } = require('../../../utils/crypto')

async function getNopacaRunLeaderboards() {
  try {
    const totalLeader = await NopacaRun.find({ totalScore: { $gt: 0 } }).sort({ totalScore: -1 }).limit(500)
    const singleRoundLeader = await NopacaRun.find({ highScore: { $gt: 0 } }).sort({ highScore: -1 }).limit(500)

    return {
      singleRoundLeader,
      totalLeader
    }
  }
  catch(err) {
    throw err
  }
}

async function getNopacaRunById(args) {
  try {
    const { id } = args;
    const data = await AlpacaRun.findOne({ discord: id })

    return data
  }
  catch(err) {
    throw err
  }
}

async function updateNopacaRunScore(args) {
  try {
    const { code } = args; //retrieve values from arguments

    const decoded = await decrypt(code)
    const { discord, score } = JSON.parse(decoded)

    const { _doc } = await NopacaRun.findOne({ discord })

    if ( _doc ) {
      const updatedScore= {
        ..._doc,
        totalScore: _doc.totalScore + score,
        highScore: score > _doc.highScore ? score : _doc.highScore,
        latestScore: score,
        updateDate: moment()
      }
  
      const nopacaRun = await NopacaRun.findOneAndUpdate( 
        { discord },
        { ...updatedScore },
        {new: true}
      )
  
      return 'Updated'
    }

    const record = new NopacaRun({
      discord,
      totalScore: score,
      highScore: score,
      latestScore: score,
    }, (err) => { if (err) throw err })

    await record.save()
    return 'New'
  }
  catch(err) {
    throw err
  }
}

module.exports = {
  getNopacaRunLeaderboards,
  getNopacaRunById,
  updateNopacaRunScore,
}