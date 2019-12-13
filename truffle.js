// Node.js 11 fix (https://github.com/aragon/aragon-cli/issues/731)
module.exports = require('@aragon/os/truffle-config')
module.exports.solc.optimizer.enabled = false
