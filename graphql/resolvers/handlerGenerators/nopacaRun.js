const moment = require('moment')
const NopacaRun = require('../../../models/nopaca_run')
const { decrypt } = require('../../../utils/crypto')

async function getNopacaRunLeaderboards() {
  try {
    const totalLeader = await NopacaRun.find({ totalScore: { $gt: 0 }, status: { $ne: 'Cheater' } }).sort({ totalScore: -1 }).limit(500)
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
    const data = await NopacaRun.findOne({ discord: id })

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
    const { discord, score, csv, calibrate, gs } = JSON.parse(decoded)

    const data = await NopacaRun.findOne({ discord })

    if ( data ) {
      const { _doc } = data;
      const { totalScore, highScore, status } = _doc;
      if ( status === 'Cheater' ) return 'Fucking Cheater'
      const records = _doc.records ? _doc.records : [];
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
    
        const nopacaRun = await NopacaRun.findOneAndUpdate( 
          { discord },
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
  
      const nopacaRun = await NopacaRun.findOneAndUpdate( 
        { discord },
        { ...updatedScore },
        {new: true}
      )
  
      return 'Updated'
    }

    if (score > 2500 || csv !== score || csv !== calibrate || gs.toFixed(2) != 18 + (0.01 * (csv))) {

      const record = new NopacaRun({
        discord,
        status: 'Cheater',
        reason: `Cheat - ${score}`,
      }, (err) => { if (err) throw err })
  
      await record.save()

      return "Don't Fucking Cheat"
    }

    const record = new NopacaRun({
      discord,
      totalScore: score,
      highScore: score,
      latestScore: score,
      records: [`${score}`],
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