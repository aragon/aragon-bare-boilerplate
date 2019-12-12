import test from 'ava'
import { startBackgroundProcess } from '../util'

test('should build an aragon app successfully', async t => {
  // act
  await startBackgroundProcess({
    cmd: 'npm',
    args: ['run', 'build'],
    execaOpts: {
      localDir: '.',
    },
    readyOutput: 'dist/script.js',
  })

  // assert
  t.pass()
})
