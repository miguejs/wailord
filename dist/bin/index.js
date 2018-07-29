#!/usr/bin/env node
'use strict';

var childProcess = require('child_process');
var program = require('commander');
var wailord = require('../index');

program.version('0.0.2').command('attach <req>').description('Attach local standard input, output, and error streams to a running container').action(function (req) {
  wailord.attach(req).then(function (response) {
    childProcess.execFileSync(response.command, response.arguments, response.options);
  }).catch(function (error) {
    process.stderr.write(error.toString());
  });
}).command('exec <req> [commands]').description('Run a command in a running container').action(function (req, commands) {
  wailord.exec(req, commands).then(function (response) {
    childProcess.execFileSync(response.command, response.arguments, response.options);
  }).catch(function (error) {
    process.stderr.write(error);
  });
});

program.parse(process.argv);