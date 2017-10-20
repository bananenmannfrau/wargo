#!/usr/bin/env node
"use strict"
const getos = require('getos')

getos((e, os) => {
  if(e) return console.error(e)
  process.detailedos = os
  let args = process.argv.slice(2)
  require('./src/cmd.js')(args)
})
