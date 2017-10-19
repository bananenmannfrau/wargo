"use strict"

const setup = require('./setup')
const cargo = require('./cargo')
const test = require('./test')
const log = require('./log')

const HELP_STR = `wargo automatically configures the emscripten compiler environment for your cargo command,
on any linux or mac os computer.

Usage:
    wargo <cargo subcommand> [<args>...]

Some special commands are:
    build   runs 'cargo build --target=wasm32... <args>'
    test    builds the test binary into WebAssembly, and then runs it using selenium
    setup   just installs emcc without building anything`

module.exports = function(argv) {
  let subcommand = argv[0]
  if (subcommand === undefined) {
      console.warn(HELP_STR)
      process.exit(0)
  }

  setup()
  switch (subcommand) {
    case 'setup':
      process.exit(0)
    case 'test':
      argv.push('--target=wasm32-unknown-emscripten')
      argv.push('--message-format=json')
      argv.push('--no-run')
      cargo(argv, (out) => {
        let lines = out.split('\n')
        for (let i in lines) {
          if (lines[i].trim().length > 0) {
            let filenames = JSON.parse(lines[i]).filenames
            if (filenames && filenames.length > 0 && filenames[0].match("\.js$")) {
              test(filenames[0])
              return
            }
          }
        }
        log("couldn't identify test binary")
        process.exit(1)
      })
      return
    case 'build':
      argv.push('--target=wasm32-unknown-emscripten')
      cargo(argv)
      return
    default:
      cargo(argv)
      return
  }
}