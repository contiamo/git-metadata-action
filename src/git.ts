import * as exec from '@actions/exec'
import {ExecOptions} from '@actions/exec'

export async function git(args: string[]): Promise<string> {
  let stdout = ''
  let stderr = ''

  const options: ExecOptions = {
    ignoreReturnCode: true
  }
  options.listeners = {
    stdout: (data: Buffer) => {
      stdout += data.toString()
    },
    stderr: (data: Buffer) => {
      stderr += data.toString()
    }
  }

  const returnCode: number = await exec.exec('git', args, options)

  if (returnCode !== 0) {
    throw new Error(stderr.trim())
  }

  return stdout.trim()
}
