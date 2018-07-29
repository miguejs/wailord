'use strict';

var Promise = require('bluebird');
var docker = require('./docker');

module.exports.attach = function (containerName) {
  return new Promise(function (resolve, reject) {
    docker.containers().then(function (containers) {
      var container = containerAvailable(containerName, containers);
      if (container) {
        var dockerArguments = ['attach', container.id];

        var command = dockerCommand(dockerArguments, { stdio: 'inherit' });
        resolve(command);
      } else {
        reject(`No container for service ${containerName}.`);
      }
    });
  });
};

module.exports.exec = function (containerName, commands) {
  return new Promise(function (resolve, reject) {
    docker.containers().then(function (containers) {
      var container = containerAvailable(containerName, containers);
      if (container) {
        if (commands.length === 0) {
          commands.push('bash');
        }
        var dockerArguments = ['exec', '-ti', container.id].concat(commands);

        var command = dockerCommand(dockerArguments, { stdio: 'inherit' });
        resolve(command);
      } else {
        reject(`No container for service ${containerName}.`);
      }
    });
  });
};

function containerAvailable(containerName, containers) {
  return containers.filter(function (item) {
    return item !== undefined;
  }).find(function (item) {
    return item.service === containerName;
  });
}

function dockerCommand(dockerArguments) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return {
    command: 'docker',
    arguments: dockerArguments,
    options
  };
}