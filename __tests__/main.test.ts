import {git} from '../src/git.js'

describe('git', () => {
  it('returns trimmed stdout on success', async () => {
    const sha = await git(['rev-parse', '--short', 'HEAD'])
    expect(sha).toMatch(/^[0-9a-f]{4,40}$/)
  })

  it('rejects with stderr when git fails', async () => {
    await expect(git(['not-a-real-subcommand'])).rejects.toThrow(
      /not-a-real-subcommand/
    )
  })
})
