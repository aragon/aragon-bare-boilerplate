import test from 'ava'
import path from 'path'
import fetch from 'node-fetch'
import { normalizeOutput } from '@aragon/cli/dist/util'
import { startProcess } from '@aragon/cli'

const RUN_CMD_TIMEOUT = 1800000 // 3min

const testSandbox = './.tmp/run'

test('should run an aragon app successfully on IPFS', async t => {
  const publishDirPath = path.resolve(`${testSandbox}/publish-dir`)

  // act
  const { output, kill } = await startProcess({
    cmd: 'npm',
    args: ['run', 'start', '--', '--publish-dir', publishDirPath],
    execaOpts: {
      localDir: '.',
    },
    readyOutput: 'Opening http://localhost:3000/#/',
    timeout: RUN_CMD_TIMEOUT,
    logger: console.log,
  })

  // hack so the wrapper has time to start
  await new Promise(resolve => setTimeout(resolve, 2 * 20 * 1000)) // TODO move to utils

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
