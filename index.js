#!/usr/bin/env node
const program = require('commander')
const fetch = require('node-fetch')
const chalk = require('chalk')
const imgcat = require('imgcat')
const store = require('data-store')('xkcd')
const rand = require('unique-random')

program
  .version('0.1.0')
  .option('-c, --current', 'most current comic')
  .option('-p, --previous', 'previous comic from current')
  .option('-n, --next', 'next comic from current')
  .option('-s, --specific <value>', 'specific comic')
  .option('-r, --random', 'random comic')
  .parse(process.argv)

async function fetchComic(url) {
  const response = await fetch(url)
  const data = await response.json()
  const { num, alt, img, title } = data
  store
    .set('current', num)
    .set('previous', num - 1)
    .set('next', num + 1)

  console.log(chalk.bold.underline.blueBright(title))
  imgcat(img).then(image => {
    console.log(image)
    console.log(chalk.greenBright(alt))
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

  default: {
    console.log('For available commands/options, reference `xk -h`')
  }
}
