#!/usr/bin/env node
const program = require('commander')
const fetch = require('node-fetch')
const chalk = require('chalk')
const imgcat = require('imgcat')

program
  .version('0.1.0')
  .option('-c, --current', 'most current comic')
  .option('-s, --specific <value>', 'specific comic')
  .parse(process.argv)

async function fetchComic(url) {
  const response = await fetch(url)
  const data = await response.json()
  const { alt, img, title } = data
    console.log(chalk.blue(title))
    imgcat(img, { log: true })
    console.log(chalk.green(alt))
}

switch(process.argv[2]) {
  case '-c': {
    return fetchComic(`https://xkcd.com/info.0.json`)
  }

  case '-s': {
    return fetchComic(`https://xkcd.com/${program.specific}/info.0.json`)
  }

  default: {
    console.log('For available commands/options, reference `xkcd -h`')
  }
}