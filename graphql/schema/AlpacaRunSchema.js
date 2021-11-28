const alpacaRunSchema = `
type RunScore {
  _id: ID!
  tokenId: String!
  totalScore: Int!
  pastMonthScore: Int!
  latestScore: Int!
  image: String
  updateDate: String
}
`

const alpacaRunQuery = `
getRunLeaderboards: [RunScore]
`

const alpacaRunMutation = `
createLeaderboard: String
updateRunScore(code: String!): String
`

module.exports = {
  alpacaRunSchema,
  alpacaRunQuery,
  alpacaRunMutation
}