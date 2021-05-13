[![build-test](https://github.com/contiamo/git-metadata-action/actions/workflows/test.yml/badge.svg)](https://github.com/contiamo/git-metadata-action/actions/workflows/test.yml)

A short but "pretty" Github Action to get the short SHA and the "semver" for the build.

| output | description |
| ------ | ----------- |
|  `shortSHA` | the output from `git rev-parse --short HEAD` |
| `semver` | this is the slightly modified output of `git describe --tags --always`, it is the tag value if you are on a tag, otherwise is is a dev build of the _next_ patch release. See the table below |

The `semver` output is inspired by [`git-semver`](https://github.com/mdomke/git-semver), the output compared to `git describe`

| `git describe`        | `semver`              |
| ---                   | ---                       |
| 3.5.1-22-gbaf822d     | 3.5.2-dev.22.baf822dd     |
| 1.0.1                 | 1.0.1                     |

Notice that it only contains `a-z0-9.`, this allows the value to be used as a Docker tag as well.

## Usage:

```yaml
name: test
on:
  # push:
  pull_request:
    types:
      - synchronize
      - opened
      - reopened

jobs:
  # Label of the container job
  tests:
    # Containers must run in Linux based operating systems
    runs-on: ubuntu-latest
    steps:
      # Downloads a copy of the code in your repository before running CI tests
      - name: Check out repository code
        uses: actions/checkout@v2
      - uses: actions/setup-go@v1
        with:
          go-version: '1.16'
      - name: Get metadata
        id: metadata
        uses: contiamo/git-metadata-action@main
      # build phase
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Login to Docker Registry
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - name: Build local docker image
        uses: docker/build-push-action@v2
        with:
          context: .
          file: ./Dockerfile
          push: false
          load: true
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache
          tags: |
            repo:${{ steps.metadata.outputs.shortSHA }}
      - name: Scan image
        id: scan
        uses: anchore/scan-action@v2
        with:
          debug: false
          fail-build: true
          severity-cutoff: critical
          image: "repo:${{ steps.metadata.outputs.shortSHA }}"

      # publish phase
      - name: Push PR Preview image
        uses: contiamo/retag-push@main
        with:
          source: repo:${{ steps.metadata.outputs.shortSHA }}
          target: |
            repo-pr:${{ github.event.pull_request.number }}
            repo-pr:${{ steps.metadata.outputs.shortSHA }}
            repo-pr:${{ steps.metadata.outputs.semver }}
```
