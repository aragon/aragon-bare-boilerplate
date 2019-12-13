import test from 'ava'
import fs from 'fs-extra'
import path from 'path'
import { startProcess, normalizeOutput } from '@aragon/cli'

const ARTIFACT_FILE = 'artifact.json'
const MANIFEST_FILE = 'manifest.json'

const PUBLISH_TIMEOUT = 120000 // 2min

const testSandbox = './.tmp'

test('should publish an aragon app directory successfully', async t => {
  const publishDirPath = path.resolve(`${testSandbox}/publish-dir`)

  // act
  const { output } = await startProcess({
    cmd: 'aragon',
    args: [
      'apm',
      'publish',
      'major',
      '--files',
      'dist',
      '--publish-dir',
      publishDirPath,
      '--skip-confirmation',
      '--no-propagate-content',
    ],
    execaOpts: {
      localDir: '.',
    },
    readyOutput: 'Successfully published',
    timeout: PUBLISH_TIMEOUT,
  })


  // check the generated artifact
  const artifactPath = path.resolve(publishDirPath, ARTIFACT_FILE)
  const artifact = JSON.parse(fs.readFileSync(artifactPath))
  // delete non-deterministic values
  delete artifact.deployment

  // check the generated manifest
  const manifestPath = path.resolve(publishDirPath, MANIFEST_FILE)
  const manifest = JSON.parse(fs.readFileSync(manifestPath))

  // delete some output sections that are not deterministic
  const publishVersion = output.match(/v[0-9]+.0.0 :/)[0]

  const buildScriptOutput = output.substring(
    output.indexOf('Building frontend [started]'),
    output.indexOf('Building frontend [completed]')
  )

  const appDeploymentOutput = output.substring(
    output.indexOf('Publish intent [completed]'),
    output.indexOf('Publish foobar.open.aragonpm.eth [started]')
  )

  const outputToSnapshot = output
    .replace(buildScriptOutput, '[deleted-build-script-output]')
    .replace(
      appDeploymentOutput,
      'Publish intent [completed][deleted-app-deployment-output]'
    )
    .replace(publishVersion, '')

  // assert
  t.snapshot(normalizeOutput(outputToSnapshot))
  t.snapshot(artifact)
  t.snapshot(manifest)
})
