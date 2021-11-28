const moment = require('moment')
const AlpacaRun = require('../../../models/alpaca_run')
const data = require('../../../utils/data')
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

async function createLeaderboard() {
  try {
    await data.map(async (e) => {

      /* init alpaca entry */
      const alpacaRun = new AlpacaRun({
        ...e
      }, (err) => { if (err) throw err })
      console.log(JSON.stringify(e))
      alpacaRun.save()

      /* console.log(`Alpaca #${index} Start`)
      const { _doc } = await AlpacaRun.findOne({ tokenId: index })
      const { image } = await request(`https://ipfs.io/ipfs/QmZBZjHSEmcYgFvSNQCwzfNsXwZdUBcjn3PA9pRojpFJQi/${index}`)
      console.log(`https://ipfs.io/ipfs/${image.replace('ipfs://','')}`)

      const updatedScore= {
        ..._doc,
        image: `https://ipfs.io/ipfs/${image.replace('ipfs://','')}`
      }

      const alpacaRun = await AlpacaRun.findOneAndUpdate( 
        { tokenId: index },
        { ...updatedScore },
        {new: true}
      )

      console.log(`Alpaca #${index} Done`) */
    })
    
    return "Done"
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
  updateRunScore,
}