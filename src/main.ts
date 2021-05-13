import * as core from '@actions/core'
import {getSemanticVersion} from '@contiamo/git-describe'
import {git} from './git'

async function run(): Promise<void> {
  let sha = ''
  try {
    sha = await git(['rev-parse', '--short', 'HEAD'])
    core.setOutput('shortSHA', sha)
  } catch (error) {
    core.setFailed(error.message)
  }

  try {
    const semver = getSemanticVersion()
    core.setOutput('semver', semver)
  } catch (error) {
    core.warning(error.message)
    // usually means there are no tags, return the shortsha instead
    core.setOutput('semver', sha)
  }
}

run()
