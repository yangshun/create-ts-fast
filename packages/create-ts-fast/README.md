# Create TypeScript Fast

Tool for creating universal npm packages (intended to run on both server and client) using TypeScript, like [`axios`](https://github.com/axios/axios), [`lodash`](https://github.com/lodash/lodash), [`clsx`](https://github.com/lukeed/clsx), [`zod`](https://github.com/colinhacks/zod).

Think Create React App for TypeScript-based npm packages.

```sh
npm create ts-fast@latest
```

## Features

Contains just enough features to help you author and publish TypeScript-based npm packages in under 15 minutes. Features include:

- **Lean and mean**: **Zero `dependencies`, minimal `devDependencies`**
  - [TypeScript](https://www.typescriptlang.org/): Modern, de facto flavor of JavaScript
  - [Vitest](https://vitest.dev/): Next generation testing framework with out-of-the-box TypeScript support. Easily replace this with Jest should you wish to
- **Unopinionated**: Includes only the absolute necessary dependencies to get you started
- **Types generation**: Type definitions will be automatically generated
- **Continuous integration**: Test, run typechecks, and build on every commit / pull request. Uses GitHub actions

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

### Scaffolded project

The scaffolded project will have the following base files:

```
├── .github/workflows/ci.yml
├── dist
├── src
│   ├── __tests__
│   └── index.ts
├── package.json
├── README.md
├── tsconfig.json
└── tsconfig.build.json
```

- `src`: Contains source code
  - `__tests__`: Directory containing tests. Code within `__tests__` will be ignored during build
  - `index.ts`: Main file
- `package.json`: Self explanatory
- `README.md`: Project's README file. Contents will be displayed on the package homepage on npmjs.com and repo homepage of github.com
- `tsconfig.json`: Base TypeScript config. Used when developing
- `tsconfig.build.json`: TypeScript config used when building, emits build artifacts within `dist`
- `dist`: Directory containing generated files. The contents of this directory is published
- `.github/workflows/ci.yml`: GitHub action that runs typechecks, tests and build

### Next steps

1. Implement your library within `src`. Add tests if you take pride in being a developer
2. Modify `package.json` – update `name`, `version`, `author` and any other relevant fields
3. Update `README.md`
4. `npm run publish`. You will have to login to npm if you aren't already logged in
5. Profit!

## Roadmap

- [x] Scaffolding command similar to `create-vite` and `create-react-app`
- [ ] Multiple output formats (esm, cjs, mjs)
- [ ] Choose between tools (Jest vs Vitest)

## Credits and inspiration

- [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)
- [create-t3-app](https://github.com/t3-oss/create-t3-app)
- [tsup](https://github.com/egoist/tsup)
- [microbundle](https://github.com/developit/microbundle)
- [tsdx](https://github.com/jaredpalmer/tsdx)
