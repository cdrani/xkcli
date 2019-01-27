#!/usr/bin/env node
const program = require("commander");
const fetch = require("node-fetch");
const chalk = require("chalk");
const imgcat = require("imgcat");
const store = require("data-store")("xkcd");
const rand = require("unique-random");

const BASE_URL = "https://xkcd.com";
const SUFFIX = "info.0.json";

const setOptions = (opts = `bold.greenBright`, type, text) =>
	store.get(type)
		? console.log(chalk`{${opts} ${text}}`)
		: console.log(chalk.bold.greenBright(text));

const fetchComic = async url => {
	const response = await fetch(url);
	const data = await response.json();
	const { num, alt, img, title } = data;
	store.set("current", num);

	let latest = store.get("latest") || store.get("current");

	if (program.current) {
		store.set("latest", num);
	}

	const isLatest = num === store.get("latest");

	store
		.set("previous", num <= 1 ? 1 : num - 1)
		.set("next", isLatest ? num : num + 1);

	setOptions(store.get("title"), "title", `${title} [${num}/${latest}]`);
	imgcat(img).then(image => {
		console.log(image);
		setOptions(store.get("alt"), "alt", alt);
	});
};


program.version("0.3.2", "-v, --version");

program
	.command("c")
	.description("display the latest comic")
	.action(() => fetchComic(`${BASE_URL}/${SUFFIX}`));

program
	.command("p")
	.description("display the previous comic based on the present comic")
	.action(() => fetchComic(`${BASE_URL}/${store.get("previous")}/${SUFFIX}`));

program
	.command("n")
	.description("display the next comic based on the present comic")
	.action(() => fetchComic(`${BASE_URL}/${store.get("next")}/${SUFFIX}`));

program
	.command("s <value>")
	.description("display specific comic ranging from first to latest")
	.action(val => {
		const latest = store.get("latest");
		if (val < 1 || val > latest) {
			return console.log(
				`Only comics ranging from 1 to ${latest} can be retrieved.`
			);
		}
		return fetchComic(`${BASE_URL}/${val}/${SUFFIX}`);
	});

program
	.command("r")
	.description("display random comic ranging from first to latest")
	.action(() =>
		fetchComic(`${BASE_URL}/${rand(1, store.get("latest"))()}/${SUFFIX}`)
	);

program
	.command("o <options>")
	.description(
		"configure chalk options to change color of output text (ref chalk package)"
	)
	.action(chalkOpts => {
		const [titleStyle, altStyle] = chalkOpts.split(",");
		return store.set("title", titleStyle).set("alt", altStyle);
	});

program
	.command("d")
	.description("display filepath to data storage location")
	.action(() => console.log(store.path));

program.parse(process.argv);

if (!program.args.length) program.help();
