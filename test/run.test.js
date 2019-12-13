import test from 'ava'
import fs from 'fs'
import fetch from 'node-fetch'
import { startProcess, normalizeOutput } from '@aragon/cli'

const RUN_TIMEOUT = 180000 // 3min

test('should run an aragon app successfully on IPFS', async t => {
  // act
  const { output, kill } = await startProcess({
    cmd: 'npm',
    args: ['run', 'start'],
    execaOpts: {
      localDir: '.',
    },
    readyOutput: 'Opening http://localhost:3000/#/',
    timeout: RUN_TIMEOUT,
    logger: console.log
  })

  // hack so the wrapper has time to start
  await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000)) // TODO move to utils

  // finding the DAO address
  const daoAddress = output.match(/DAO address: (0x[a-fA-F0-9]{40})/)[1]

  // TODO: fetch the counter app instead
  const fetchResult = await fetch(`http://localhost:3000/#/${daoAddress}`)
  const fetchBody = await fetchResult.text()

  // cleanup
  await kill()

  const outputToSnapshot = output.replace(
    new RegExp(daoAddress, 'g'),
    '[deleted-dao-address]'
  )

  // assert
  t.snapshot(normalizeOutput(outputToSnapshot))
  t.snapshot(fetchResult.status)
  t.snapshot(fetchBody)
})
