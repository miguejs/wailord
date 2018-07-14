#!/usr/bin/env node
const program = require('commander');
const util = require('util');
const Promise = require("bluebird");
const child_process =  require('child_process')
const exec = util.promisify(require('child_process').exec);

async function inspectContainer(containerId) {
  if (containerId) {
    const { stdout, stderr } = await exec(`docker inspect ${containerId}`);
    const { Config } = JSON.parse(stdout)[0]
    if (Config) {
      params = {
        service: Config.Labels["com.docker.compose.service"],
        id: containerId
      }
      return params
    } else {
      return { service: ''}
    }

  }
}
program
  .version('0.0.1')
  .command('attach <req> [optional]')
  .description('command description')
  .option('-o, --option',"we can still have add'l options")
  .action(function(req,optional){
    exec('docker ps -q').then( (response) => {
      let promises =  response.stdout.split("\n").map( async item => { return inspectContainer(item)})
      Promise.all(promises).then( (responses => {
       const container = responses.filter(item => item != undefined).find( item => item.service === req)
        if (container) {
        child_process.execFileSync('docker', ['attach', container.id], {stdio: 'inherit'});
        } else {
          console.log("No container for service", req )
        }
      }))
    })
  });
  program.parse(process.argv);