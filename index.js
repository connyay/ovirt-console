#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    ini = require('ini'),
    spawn = require('child_process').spawn,
    program = require('commander'),
    version = require('./package.json').version;

program
    .version(version)
    .option('-k, --keep', 'Keep the console.vv file')
    .parse(process.argv);

var consoleFile = program.args;
if (!consoleFile || !consoleFile.length) {
    consoleFile = (process.env.HOME + '/Downloads/console.vv');
} else {
    consoleFile = consoleFile[0];
}
var consoleFileData = fs.readFileSync(consoleFile, 'utf-8');
if (!consoleFileData) {
    console.error('Could not read ' + consoleFile);
    process.exit(1);
}
var consoleSettings = ini.parse(consoleFileData);
var virtSettings = consoleSettings['virt-viewer'];
if (virtSettings) {
    var pass = virtSettings.password,
        host = virtSettings.host,
        port = virtSettings.port;
    var vncUrl = 'vnc://:' + pass + '@' + host + ':' + port;
   spawn('open', [vncUrl]);

    if (!program.keep && virtSettings['delete-this-file'] !== 0) {
        fs.unlinkSync(consoleFile);
    }
}
process.exit(0);
