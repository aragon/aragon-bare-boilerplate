const { remove } = require('fs-extra')
const { killProcessOnPort } = require('@aragon/cli')

const IPFS_API_PORT = 5001
const DEVCHAIN_PORT = 8545

const LOGGER_PREFIX = '[placeholder-app-name:posttest]'

const publishTestSandbox = './.tmp/publish'

const runTestSandbox = './.tmp/run'

const logger = (...messages) => {
  console.log(LOGGER_PREFIX, ...messages)
}

Promise.all([
  remove(publishTestSandbox),
  remove(runTestSandbox),
  killProcessOnPort(IPFS_API_PORT),
  killProcessOnPort(DEVCHAIN_PORT),
])
  .then(() => {
    logger(`Processes killed on ports: ${IPFS_API_PORT}, ${DEVCHAIN_PORT}`)
  })
  .catch(() => {
    logger(
      `Cannot kill processes on ports: ${IPFS_API_PORT}, ${DEVCHAIN_PORT}}`
    )
  })
