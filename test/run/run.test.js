import test from 'ava'
import fetch from 'node-fetch'
import { startBackgroundProcess, normalizeOutput } from '../util'
import fs from 'fs'

test('should run an aragon app successfully on IPFS', async t => {
  // // Node.js 11 fix (https://github.com/aragon/aragon-cli/issues/731)
  // fs.writeFileSync(
  //   'truffle.js',
  //   `
  //   module.exports = require('@aragon/os/truffle-config');
  //   module.exports.solc.optimizer.enabled = false;
  // `
  // )

  // act
  const { stdout, exit } = await startBackgroundProcess({
    cmd: 'npm',
    args: ['run', 'start'],
    execaOpts: {
      localDir: '.',
    },
    readyOutput: 'Opening http://localhost:3000/#/',
  })

  // hack so the wrapper has time to start
  await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000)) // TODO move to utils

  // finding the DAO address
  const daoAddress = stdout.match(/DAO address: (0x[a-fA-F0-9]{40})/)[1]

  // TODO: fetch the counter app instead
  const fetchResult = await fetch(`http://localhost:3000/#/${daoAddress}`)
  const fetchBody = await fetchResult.text()

  // cleanup
  await exit()

  const outputToSnapshot = stdout.replace(
    new RegExp(daoAddress, 'g'),
    '[deleted-dao-address]'
  )

  // assert
  t.snapshot(normalizeOutput(outputToSnapshot))
  t.snapshot(fetchResult.status)
  t.snapshot(fetchBody)
})
