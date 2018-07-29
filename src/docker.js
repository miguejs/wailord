const util = require('util')
const exec = util.promisify(require('child_process').exec)
const Promise = require('bluebird')

async function inspectContainer(containerId) {
  if (containerId) {
    const {stdout} = await exec(`docker inspect ${containerId}`)
    const {Config} = JSON.parse(stdout)[0]
    if (Config) {
      const params = {
        service: Config.Labels['com.docker.compose.service'],
        id: containerId,
      }
      return params
    }
    return {service: ''}
  }
  return {service: ''}
}

module.exports.containers = function containers() {
  return new Promise((resolve, reject) => {
    exec('docker ps -q')
      .then(response => {
        const rawContainers = response.stdout.split('\n')
        const containerPromises = rawContainers.map(container =>
          inspectContainer(container),
        )
        Promise.all(containerPromises)
          .then(payload => {
            resolve(payload)
          })
          .catch(error => {
            reject(error)
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}
