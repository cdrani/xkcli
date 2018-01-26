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
  .version('0.3.2')
  .option('-c, --current', 'latest comic')
  .option('-p, --previous', 'previous comic based on the present comic')
  .option('-n, --next', 'next comic based on the present comic')
  .option(
    '-s, --specific <value>',
    'specific comic ranging from first to latest'
  )
  .option('-r, --random', 'random comic ranging from first to latest')
  .option(
    '-o, --options <options>',
    'configure chalk options (ref. chalk package)',
    list
  )
  .parse(process.argv)

async function fetchComic(url) {
  const response = await fetch(url)
  const data = await response.json()
  const { num, alt, img, title } = data
  store.set('current', num)

  const latest = store.get('latest') || store.get('current')
  const isLatest = num === latest

  store
    .set('previous', num <= 1 ? 1 : num - 1)
    .set('next', isLatest ? num : num + 1)
    .set('latest', isLatest ? num : latest)

  setOptions(store.get('title'), 'title', `${title} [${num}/${latest}]`)
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
    const latest = store.get('latest')
    const specificNum = program.specific
    if (specificNum < 1 || specificNum > latest) {
      return console.log(
        `Only comics ranging from 1 to ${latest} can be retrieved.`
      )
    }
    return fetchComic(`https://xkcd.com/${specificNum}/info.0.json`)
  }

  case '-r': {
    return fetchComic(
      `https://xkcd.com/${rand(1, store.get('latest'))()}/info.0.json`
    )
  }

  case '-o': {
    return store.set('title', program.options[0]).set('alt', program.options[1])
  }

  default: {
    console.log('For available commands/options, reference `xk -h`')
  }
}
