const { buildSchema } = require('graphql')
const { alpacaRunSchema, alpacaRunQuery, alpacaRunMutation } = require('./AlpacaRunSchema')

module.exports = buildSchema(`
${alpacaRunSchema}
type RootQuery {
  ${alpacaRunQuery}
}
type RootMutation {
  ${alpacaRunMutation}
}
schema {
  query: RootQuery
  mutation: RootMutation
}
`)
