#!/usr/bin/env node
const childProcess = require('child_process')
const program = require('commander')
const wailord = require('../index')

program
  .version('0.0.2')
  .command('attach <req>')
  .description(
    'Attach local standard input, output, and error streams to a running container',
  )
  .action((req, _optional) => {
    wailord
      .attach(req)
      .then(response => {
        childProcess.execFileSync(
          response.command,
          response.arguments,
          response.options,
        )
      })
      .catch(error => {
        process.stderr.write(error.toString())
      })
  })
  .command('exec <req> [commands]')
  .description('Run a command in a running container')
  .action((req, commands) => {
    wailord
      .exec(req, commands)
      .then(response => {
        childProcess.execFileSync(
          response.command,
          response.arguments,
          response.options,
        )
      })
      .catch(error => {
        process.stderr.write(error)
      })
  })

program.parse(process.argv)
