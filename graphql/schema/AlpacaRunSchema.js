const alpacaRunSchema = `
type RunScore {
  _id: ID!
  tokenId: String!
  totalScore: Int!
  pastMonthScore: Int!
  highScore: Int!
  pastHighScore: Int!
  latestScore: Int!
  image: String
  updateDate: String
}

type NopacaRunScore {
  _id: ID!
  discord: String!
  totalScore: Int!
  highScore: Int!
  latestScore: Int!
  updateDate: String
}

type RunLeaderBoard {
  singleRoundLeader: [RunScore]
  totalLeader: [RunScore]
}

type NopacaRunLeaderBoard {
  singleRoundLeader: [NopacaRunScore]
  totalLeader: [NopacaRunScore]
}
`

const alpacaRunQuery = `
getRunLeaderboards: RunLeaderBoard
getRunById(id: String!): RunScore
getNopacaRunLeaderboards: NopacaRunLeaderBoard
getNopacaRunById(id: String!): NopacaRunScore
`

const alpacaRunMutation = `
updateRunScore(code: String!): String
updateNopacaRunScore(code: String!): String
resetRun: String
`

module.exports = {
  alpacaRunSchema,
  alpacaRunQuery,
  alpacaRunMutation
}