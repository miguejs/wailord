const Promise = require('bluebird')
const docker = require('./docker')

module.exports.attach = function attach(containerName) {
  return new Promise((resolve, reject) => {
    docker.containers().then(containers => {
      const container = containerAvailable(containerName, containers)
      if (container) {
        const dockerArguments = ['attach', container.id]
        const options = {stdio: 'inherit'}
        const command = dockerCommand(dockerArguments, options)
        resolve(command)
      } else {
        reject(`No container for service ${containerName}.`)
      }
    })
  })
}

module.exports.exec = function exec(containerName, commands) {
  return new Promise((resolve, reject) => {
    docker.containers().then(containers => {
      const container = containerAvailable(containerName, containers)
      if (container) {
        if (commands.length === 0) {
          commands.push('bash')
        }
        const dockerArguments = ['exec', '-ti', container.id].concat(commands)
        const options = {stdio: 'inherit'}
        const command = dockerCommand(dockerArguments, options)
        resolve(command)
      } else {
        reject(`No container for service ${containerName}.`)
      }
    })
  })
}

function containerAvailable(containerName, containers) {
  return containers
    .filter(item => item !== undefined)
    .find(item => item.service === containerName)
}

function dockerCommand(dockerArguments, options = {}) {
  return {
    command: 'docker',
    arguments: dockerArguments,
    options,
  }
}
