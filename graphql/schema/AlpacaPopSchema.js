const alpacaPopSchema = `
type PopScore {
  _id: ID!
  tokenId: String!
  totalScore: Int!
  pastMonthScore: Int!
  latestScore: Int!
  image: String
  updateDate: String
}
`

const alpacaPopQuery = `
getPopLeaderboards: [PopScore]
`

const alpacaPopMutation = `
updatePopScore(code: String!): String
`

module.exports = {
  alpacaPopSchema,
  alpacaPopQuery,
  alpacaPopMutation
}