import test from 'ava'
import fetch from 'node-fetch'
import { startProcess } from '@aragon/toolkit/dist/node'
import { normalizeOutput } from '@aragon/cli/dist/util'

const RUN_TIMEOUT = 180000 // 3min

test('should run an aragon app successfully on IPFS', async t => {
  // act
  const { stdout, exit } = await startProcess({
    cmd: 'npm',
    args: ['run', 'start'],
    execaOpts: {
      localDir: '.',
    },
    readyOutput: 'Opening http://localhost:3000/#/',
    timeout: RUN_TIMEOUT,
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
