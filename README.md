# WriteMe

Write docs like [docusaurus](https://docusaurus.io/) with:

## Install

Just run:

```bash
yarn create next-app my-docs --typescript --example https://github.com/g4rcez/writeme
cd my-docs
yarn run init
```

You can see the [Getting Started](https://writeme.vercel.app/docs/project/getting-started)

## Features

- Built with [NextJS](https://nextjs.org/)
- Parse document with [remark + plugins](https://github.com/remarkjs)
- Accept [MDX](https://github.com/hashicorp/next-mdx-remote) out of the box
- [TailwindCSS](https://tailwindcss.com/)
- Code highlight with prism
- Code playground with [React Live](https://github.com/FormidableLabs/react-live)
- Docs in `/docs/**`
- Proxy frontend requests
- Parse HTTP request from `curl` command
- Support OpenGraph images
- **NEW** Support youtube opengraph videos
- **NEW** Support FlowChart using [flowchart.js](https://flowchart.js.org/)

### Remark plugins

- https://github.com/remarkjs/remark-gemoji
- https://github.com/remarkjs/remark-gfm
- https://github.com/remarkjs/remark-github

## ToDo - Design
- [ ] Improvements for text reading
- [ ] Improvements for documents layouts
- [ ] 

## ToDo - System preferences
- [ ] Save preferred mode
- [ ] Save preferred language

## ToDo - Markdown write
- [ ] Language setup for all code blocks. Context to choose multiple languages
- [ ] Support for `.env` in code blocks
- [ ] Code blocks with tabs
