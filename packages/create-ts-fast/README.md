# Create TypeScript Fast

Create React App but for creating TypeScript-based packages to be published to the npm registry.

```sh
npm create ts-fast@latest
```

Currently supported templates:

- **Universal**: Platform-agnostic utilities intended to run on both server and client (e.g. [`axios`](https://github.com/axios/axios), [`lodash`](https://github.com/lodash/lodash), [`clsx`](https://github.com/lukeed/clsx), [`zod`](https://github.com/colinhacks/zod))
- **React hooks**: Custom React hooks (e.g. [`react-use`](https://github.com/streamich/react-use), [`usehooks-ts`](https://github.com/juliencrn/usehooks-ts))

## Features

Contains just enough features to help you author and publish TypeScript-based npm packages in under 15 minutes. Features include:

- **Lean and mean**: **Zero `dependencies`, minimal `devDependencies`**
  - [TypeScript](https://www.typescriptlang.org/): Modern, de facto flavor of JavaScript
  - [Vitest](https://vitest.dev/): Next generation testing framework with out-of-the-box TypeScript support. Easily replace this with Jest should you wish to
  - [tsup](https://tsup.egoist.dev/): Bundles your TypeScript code, powered by [esbuild](https://esbuild.github.io/)
- **Unopinionated**: Includes only the necessary dependencies to get you started
- **Types generation**: Type declaration files are automatically generated
- **Continuous integration**: Test, typecheck, and build on every commit / pull request. Uses GitHub actions

### Where's pnpm, ESLint, Prettier, and &lt;trendy library&gt;?

The project is unopinionated about the following:

- Alternative package managers, e.g. pnpm, Yarn
- Linting, e.g. ESLint, Biome, oxlint
- Formatting, e.g Prettier, Biome
- Alternative runtimes e.g. Bun, Deno

Why? Because no matter the choice, someone will have a different opinion and want to use something else, so we rather leave it to you. Moreover, these tools can be easily added yourself.

If/when one of them becomes the standard (e.g. TypeScript), we can then include them as a default.

## Getting started

Run the scaffolding command, use the scaffolded project as a **starting point** and **customize** it to your liking.

Start by running the appropriate command and answering a few questions:

### npm

```sh
npm create ts-fast@latest
```

### Yarn

```sh
yarn create ts-fast
```

### pnpm

```sh
pnpm create ts-fast@latest
```

### bun

```sh
bun create ts-fast@latest
```

### Scaffolded project structure

Scaffolded projects have these few base files:

```
├── .github/workflows/ci.yml
├── dist
├── src
│   ├── __tests__
│   └── index.ts
├── package.json
├── README.md
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts
```

### Next steps

1. Implement your library within `src`. Add tests if you take pride in being a developer
2. Modify `package.json` – update `name`, `version`, `author` and any other relevant fields
3. Update `README.md`
4. `npm run publish`. You will have to login to npm if you aren't already logged in
5. Profit!

## Roadmap

- [x] Scaffolding command similar to `create-vite` and `create-react-app`
- [x] Multiple output formats (esm, cjs)
- [ ] Choose between tools (Jest vs Vitest)

## Credits and inspiration

- [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)
- [create-t3-app](https://github.com/t3-oss/create-t3-app)
- [tsup](https://github.com/egoist/tsup)
- [microbundle](https://github.com/developit/microbundle)
- [tsdx](https://github.com/jaredpalmer/tsdx)
