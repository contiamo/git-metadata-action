import * as core from '@actions/core'
import {getSemanticVersion} from '@contiamo/git-describe'
import {git} from './git'

async function run(): Promise<void> {
  try {
    const sha = await git(['rev-parse', '--short', 'HEAD'])
    core.setOutput('shortSHA', sha)

    const semvar = getSemanticVersion()
    core.setOutput('semvar', semvar)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
