import test from 'ava'
import fs from 'fs-extra'
import path from 'path'
import { startBackgroundProcess, normalizeOutput } from '../util'

const ARTIFACT_FILE = 'artifact.json'
const MANIFEST_FILE = 'manifest.json'

test('should publish an aragon app directory successfully', async t => {
  const publishDirPath = 'publish-dir'

  // act
  const publishProcess = await startBackgroundProcess({
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
  })

  // cleanup
  await publishProcess.exit()

  // check the generated artifact
  const artifactPath = path.resolve(publishDirPath, ARTIFACT_FILE)
  const artifact = JSON.parse(fs.readFileSync(artifactPath))
  // delete non-deterministic values
  delete artifact.deployment

  // check the generated manifest
  const manifestPath = path.resolve(publishDirPath, MANIFEST_FILE)
  const manifest = JSON.parse(fs.readFileSync(manifestPath))

  // delete some output sections that are not deterministic
  const publishVersion = publishProcess.stdout.match(/v[0-9]+.0.0 :/)[0]

  const buildScriptOutput = publishProcess.stdout.substring(
    publishProcess.stdout.indexOf('Building frontend [started]'),
    publishProcess.stdout.indexOf('Building frontend [completed]')
  )

  const appDeploymentOutput = publishProcess.stdout.substring(
    publishProcess.stdout.indexOf('Publish intent [completed]'),
    publishProcess.stdout.indexOf('Publish foobar.open.aragonpm.eth [started]')
  )

  const outputToSnapshot = publishProcess.stdout
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
