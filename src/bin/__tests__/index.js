import path from 'path'
import spawn from 'spawn-command'
import stripAnsi from 'strip-ansi'

const SPLIT_GUIDE_PATH = require.resolve('../index')
const BABEL_BIN_PATH = require.resolve('babel-cli/bin/babel-node')

test('wailord --help', () => {
  return runWailordGuideCLI('--help').then(stdout => {
    expect(stdout).toMatchSnapshot('wailord --help stdout')
  })
})

function runWailordGuideCLI(args = '', cwd = process.cwd()) {
  const isRelative = cwd[0] !== '/'
  if (isRelative) {
    cwd = path.resolve(__dirname, cwd)
  }

  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''
    const command = `${BABEL_BIN_PATH} -- ${SPLIT_GUIDE_PATH} ${args}`
    const child = spawn(command, {cwd})

    child.on('error', error => {
      reject(error)
    })

    child.stdout.on('data', data => {
      stdout += stripAnsi(data.toString())
    })

    child.stderr.on('data', data => {
      stderr += stripAnsi(data.toString())
    })

    child.on('close', () => {
      if (stderr) {
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}
