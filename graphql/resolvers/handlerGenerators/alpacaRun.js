const moment = require('moment')
const { map } = require('lodash')
const AlpacaRun = require('../../../models/alpaca_run')
const NopacaRun = require('../../../models/nopaca_run')
const RunArchive = require('../../../models/run_score_archives')
const { decrypt } = require('../../../utils/crypto')

async function getRunLeaderboards() {
  try {
    const totalLeader = await AlpacaRun.find({ totalScore: { $gt: 0 }, status: { $ne: 'Cheater' } }).sort({ totalScore: -1 }).limit(500)
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
    const { tokenId, score, csv, calibrate, gs } = JSON.parse(decoded)

    const { _doc } = await AlpacaRun.findOne({ tokenId })
    const { totalScore, highScore, status } = _doc
    if ( status === 'Cheater' ) return 'Fucking Cheater'
    const records = _doc.records ? _doc.records : []
    if (records.length === 10) records.pop();

    if (score > 2500 || csv !== score || csv !== calibrate || gs.toFixed(2) != 18 + (0.01 * (csv))) {
      let record = `unrealistic score - ${score} / csv ${csv}`
      if (gs.toFixed(2) != 18 + (0.01 * (csv)))  record = `game speed tempering - gamespeed cal ${gs.toFixed(2) != 18 + (0.01 * (csv))} / csv ${csv}`
      if (csv !== calibrate)  record = `calibration tempering - ${calibrate} / csv ${csv}`
      records.unshift(record)

      const updatedScore= {
        ..._doc,
        records,
        status: 'Cheater',
        reason: `${record} - ${score}`,
        updateDate: moment()
      }
  
      const alpacaRun = await AlpacaRun.findOneAndUpdate( 
        { tokenId },
        { ...updatedScore },
        {new: true}
      )

      return "Don't Fucking Cheat"
    }
    records.unshift(`${score}`)

    const updatedScore= {
      ..._doc,
      totalScore: totalScore + score,
      highScore: score > highScore ? score : highScore,
      latestScore: score,
      records,
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

async function resetRun(args) {
  try {
    const { code } = args; 
    if (!code || code !== 'Cass525Y') return 'Done'

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