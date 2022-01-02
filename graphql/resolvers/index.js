const alpacaPopHandlers = require('./handlerGenerators/alpacaPop')
const alpacaRunHandlers = require('./handlerGenerators/alpacaRun')
const nopacaRunHandlers = require('./handlerGenerators/nopacaRun')

module.exports = {
  ...alpacaPopHandlers,
  ...alpacaRunHandlers,
  ...nopacaRunHandlers,
}
