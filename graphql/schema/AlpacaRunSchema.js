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

type RunLeaderBoard {
  singleRoundLeader: [RunScore]
  totalLeader: [RunScore]
}
`

const alpacaRunQuery = `
getRunLeaderboards: RunLeaderBoard
getRunById(id: String!): RunScore
`

const alpacaRunMutation = `
updateRunScore(code: String!): String
updateRunField: String
`

module.exports = {
  alpacaRunSchema,
  alpacaRunQuery,
  alpacaRunMutation
}