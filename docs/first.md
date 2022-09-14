---yaml
title: Visible name
createdAt: 2022-09-13T04:14:57.330Z
index: 1
category: getting-started
tags:

- id: docs
  url: docs
  title: Documentation

---

# Common Markdown

- [I'm a link](https://github.com/g4rcez)
- **Bold**
- *Italic*
- ***Bold + Italic***
- ~~Strike~~

1. List
2. With
3. Numbers

- [ ] Task pending
- [x] Task completed

> Blockquote

![Here is an example](https://via.placeholder.com/150)
Image example

# Emojis :smile:

Support emojis using [remark-gemoji](https://github.com/remarkjs/remark-gemoji). You can view
the [Emoji CheatSheet](https://www.webfx.com/tools/emoji-cheat-sheet/). Note: **not all emojis is supported**

:smile: :laughing: :blush: :smiley: :smirk: :heart_eyes: :kissing_heart: :kissing_closed_eyes: :flushed: :relieved: :
satisfied: :grin: :wink: :stuck_out_tongue_winking_eye: :stuck_out_tongue_closed_eyes: :alien: :virgo: :ghost: :
signal_strength:

There's no place like :house:

# Tabs

Support tabs with MDX or using comment with `<!-- |tabs -->` to open and `<!-- /tabs -->` to close. In comment mode, you
can pass the default tab after `|tabs`

<!-- |tabs second -->

## First

This is first tab content

## Second

This is second tab content

<!-- /tabs -->

## Http Request

Focus in web API docs, this component receive a `curl` command and transform in amazing http request visualizer. Create
a code mark with bash language and pass `type=request`

````bash
```bash type=request
curl -X POST "{{host}}/api/test" -H "Content-Type: application/json" -d '{"email":"write@me.com"}'
```
````

```bash type=request
curl -X POST "{{host}}/api/test" -H "Content-Type: application/json" -d '{"email":"write@me.com"}'
```

~~This component is connected to `HttpResponse` using the `HttpContext` and share the state about request/response to
create a better experience for readers. This integration may have
bugs `Error: Parse Error: Content-Length can't be present with Transfer-Encoding`. If you know how to solve this
problem, please open a [Pull Request](https://github.com/g4rcez/writeme/pulls)~~
**HttpRequest and HttpResponse now is a single component**


<Playground />
