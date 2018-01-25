# xkcli

---

## Basis:

Simple terminal based xkcd comic viewer. CLI will display the title, alt text,
and image of a comic.

## Usage

Installation: `npm install xkcli --global`

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

## References

[xkcd.com](https://xkcd.com/) | [xkcd api](https://xkcd.com/json.html)
