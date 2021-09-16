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

### Remark plugins

- https://github.com/remarkjs/remark-gemoji
- https://github.com/remarkjs/remark-gfm
- https://github.com/remarkjs/remark-github

## ToDo

- [x] Proxy requests using NextJS `/api`
- [x] Use the same docusaurus DX
- [x] Implement Github PR/issues opengraph style
- [x] Group docs by project
- [x] Order docs by key in header (parsed by [gray-matter](https://github.com/jonschlinkert/gray-matter))
- [ ] Better layout for sidebar
- [ ] Integration with [shields.io](https://shields.io)
- [ ] Add puppeteer to create opengraph images
- [ ] Create `before` and `next` link at end of docs
- [ ] Add shortcuts support with [shortcut-keys](https://github.com/leoavelino7/shortcut-keys)
- [ ] Create `writemerc.json` for global config
- [ ] Support `/blog`. Organize blog posts by `/blog/year/month/day/post-name`
- [ ] Support style customization (using design tokens)
- [ ] create-next-app example (for alpha/beta versions)
- [ ] Add Dark Mode
- [ ] Deploy as lib
- [ ] i18n
