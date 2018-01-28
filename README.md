# xkcli

---

## Basis:

Simple terminal based xkcd comic viewer. CLI will display the title, alt text,
and image of a comic.

## Usage

Installation: `npm install xkcli --global`

NOTE: The first command run should be `xk -c`. This command not only
fetches the latest comic, but saves the comic number as well. Other options, such as `xk -s` and `xk -r` are reliant on the latest comic number (see descriptions below).

```bash
Usage: xk [options]

Options:
  -V, --version            output the version number
  -c, --current            latest comic
  -p, --previous           previous comic based on the present comic
  -n, --next               next comic based on the present comic
  -s, --specific <value>   specific comic ranging from first to latest
  -r, --random             random comic ranging from first to latest
  -o, --options <options>  configure chalk options
  -h, --help               output usage information
```

## `xk -o`

This option allows the manipulation of the title text and the alt text (at
the bottom). These texts can be styled using [**chalk**](https://github.com/chalk/chalk).

**example**:

```bash
xk -o bold.whiteBright.bgBlackBright,italic.yellowBright
```

The `bold.whiteBright.bgBlackBright` is applied to the title text, and the
`italic.yellowBright` is applied to the alt text.

## References

[xkcd.com](https://xkcd.com/) | [xkcd api](https://xkcd.com/json.html)
