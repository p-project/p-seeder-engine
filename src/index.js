#!/usr/bin/env node

import app from './vendor/express'
import program from 'commander'
import { config, setOptions } from './config'

program
  .option('-p --port <port>', 'Specify the port the daemon will listen on for commands.')
  .option('-o --out <path>', 'Specify the path where downloaded files will be written.')
  .parse(process.argv)

setOptions(program)

app.listen(config.pseeder.port, () => console.log('listening on port ' + config.pseeder.port))
