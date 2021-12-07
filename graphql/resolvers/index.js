const alpacaPopHandlers = require('./handlerGenerators/alpacaPop')
const alpacaRunHandlers = require('./handlerGenerators/alpacaRun')

module.exports = {
  ...alpacaPopHandlers,
  ...alpacaRunHandlers,
}
