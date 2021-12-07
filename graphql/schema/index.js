const { buildSchema } = require('graphql')
const { alpacaPopSchema, alpacaPopQuery, alpacaPopMutation } = require('./AlpacaPopSchema')
const { alpacaRunSchema, alpacaRunQuery, alpacaRunMutation } = require('./AlpacaRunSchema')

module.exports = buildSchema(`
${alpacaPopSchema}
${alpacaRunSchema}
type RootQuery {
  ${alpacaPopQuery}
  ${alpacaRunQuery}
}
type RootMutation {
  ${alpacaPopMutation}
  ${alpacaRunMutation}
}
schema {
  query: RootQuery
  mutation: RootMutation
}
`)
