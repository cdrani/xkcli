# xkcd-cli

---

## Basis:

This is a simple terminal based xkcd comic viewer based on my blog post: [Create A CLI App](https://cdrainxv.github.io/blog/cli/2017/11/18/creating-a-cli-app.html). The motivation was because of my love for the site, [xkcd](https://xkcd.com), and the various Node CLI packages I've been
using recently. I wanted to create my own simple one and this is the outcome:

##  Usage

```bash
Usage: xk [options]

Options:
  -V, --version          ouput the version number
  -c, --current          most current comic
  -p, --previous         previous comic from current
  -n, --next             next comic from from current
  -s, --specific <value> specifc comic
  -r, --random           random comic
  -h, --help             output usage information
```

