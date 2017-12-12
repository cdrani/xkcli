#!/usr/bin/env node
const program = require('commander')
const fetch = require('node-fetch')
const chalk = require('chalk')
const imgcat = require('imgcat')
const store = require('data-store')('xkcd')
const rand = require('unique-random')

const list = chalk_opts => chalk_opts.split(',')
const setOptions = (opts = `bold.greenBright`, type, text) =>
  store.get(type)
    ? console.log(chalk`{${opts} ${text}}`)
    : console.log(chalk.bold.greenBright(text))

program
  .version('0.2.0')
  .option('-c, --current', 'most current comic')
  .option('-p, --previous', 'previous comic from current')
  .option('-n, --next', 'next comic from current')
  .option('-s, --specific <value>', 'specific comic')
  .option('-r, --random', 'random comic')
  .option('-o, --options <options>', 'chalk options', list)
  .parse(process.argv)

async function fetchComic(url) {
  const response = await fetch(url)
  const data = await response.json()
  const { num, alt, img, title } = data
  store
    .set('current', num)
    .set('previous', num - 1)
    .set('next', num + 1)

  setOptions(store.get('title'), 'title', title)
  imgcat(img).then(image => {
    console.log(image)
    setOptions(store.get('alt'), 'alt', alt)
  })
}

switch (process.argv[2]) {
  case '-c': {
    return fetchComic(`https://xkcd.com/info.0.json`)
  }

  case '-p': {
    return fetchComic(`https://xkcd.com/${store.get('previous')}/info.0.json`)
  }

  case '-n': {
    return fetchComic(`https://xkcd.com/${store.get('next')}/info.0.json`)
  }

  case '-s': {
    return fetchComic(`https://xkcd.com/${program.specific}/info.0.json`)
  }

  case '-r': {
    return fetchComic(
      `https://xkcd.com/${rand(1, store.get('current'))()}/info.0.json`
    )
  }

  case '-o': {
    return store.set('title', program.options[0]).set('alt', program.options[1])
  }

  default: {
    console.log('For available commands/options, reference `xk -h`')
  }
}
