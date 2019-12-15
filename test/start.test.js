import test from 'ava'
import { startProcess } from '@aragon/cli'

const START_CMD_TIMEOUT = 20000 // 20s

test('start', async t => {
  // act
  const { kill } = await startProcess({
    cmd: 'aragon',
    args: ['start', '--no-openInBrowser'],
    execaOpts: {
      localDir: '.',
    },
    readyOutput: 'started on port',
    timeout: START_CMD_TIMEOUT,
  })

  // cleanup
  await kill()

  // assert
  t.pass()
})
