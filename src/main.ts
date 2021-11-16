import * as core from '@actions/core'
import {getSemanticVersion} from '@contiamo/git-describe'
import {git} from './git'

async function run(): Promise<void> {
  let sha = ''
  try {
    sha = await git(['rev-parse', '--short', 'HEAD'])

    core.setOutput('shortSHA', sha)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    core.setFailed(msg)
  }

  try {
    // remove any `+` signs
    const regex = /\+/i
    const semver = getSemanticVersion()
    core.setOutput('semver', semver.replace(regex, '.'))
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    core.warning(msg)
    // usually means there are no tags, return the shortsha instead
    core.setOutput('semver', sha)
  }
}

run()
