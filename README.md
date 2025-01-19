# npm TypeScript Boilerplate

Unopinionated boilerplate for creating npm packages like [`axios`](https://github.com/axios/axios), [`lodash`](https://github.com/lodash/lodash), [`clsx`](https://github.com/lukeed/clsx), [`zod`](https://github.com/colinhacks/zod) using TypeScript.

## Features

Contains just enough features to help you author and publish TypeScript-based npm packages in under 15 minutes. Features include:

- **Lean and mean**: **Zero `dependencies`, minimal `devDependencies`**
  - [TypeScript](https://www.typescriptlang.org/): Modern, de facto flavor of JavaScript
  - [Vitest](https://vitest.dev/): Next generation testing framework with out-of-the-box TypeScript support. Easily replace this with Jest should you wish to
- **Unopinionated**: Includes only the absolute necessary dependencies to get you started
- **Types generation**: Type definitions will be automatically generated
- **Continuous integration**: Test, run typechecks, and build on every commit / pull request. Uses GitHub actions

### Where's pnpm, ESLint, Prettier, and &lt;favorite library&gt;?

This boilerplate does not have opinions on the following:

- Alternative package managers, e.g. pnpm, Yarn
- Linting, e.g. ESLint, Biome
- Formatting, e.g Prettier, Biome
- Alternative runtimes e.g. Bun, Deno

Why? Because no matter the choice, someone will have an opinion and want to use something else, so we rather leave it to you. Moreover, these tools can be easily added yourself.

If/when one of them becomes the standard (e.g. TypeScript), we can then include them as part of the boilerplate.

## How to use

This is not a library. You're supposed to clone the code, use it as a **starting point** and **customize** it to your liking.

Go from zero to npm hero in 7 steps:

1. Click "Use this template" at the top right of the repo homepage to create a clone of the repo template
2. Clone your new repo to your computer. **Do not clone this repository!**
3. Implement your library within `src`. Add tests if you take pride in being a developer
4. Modify `package.json` – update `name`, `version`, `author` and any other relevant fields
5. Update `README.md`
6. `npm run publish`. You will have to login to npm if you aren't already logged in
7. Profit!

## Commands

- `npm run check`: Checks code within `src` for TypeScript issues. No artifacts are generated
- `npm test`: Single test run using Vitest
- `npm test:watch`: Watch mode. Runs all test suites and reruns them when there are changes
- `npm run build`: Compiles `src` into JavaScript and TypeScript definitions into `dist` directory
- `npm run ci`: Run typechecks + run tests + build. Suitable for running locally when developing and in CI environments
- `npm run clean`: Deletes the `dist` directory
- `npm run release`: Publish to npm directory. Published only if `npm run ci` is successful

## Directory walkthrough

```
├── .github/workflows/ci.yml
├── dist
├── src
│   ├── __tests__
│   └── index.ts
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── tsconfig.build.json
```

- `src`: Contains source code
  - `__tests__`: For writing tests. Code within `__tests__` will be ignored during build
- `package.json`: Self explanatory
- `README.md`: Project's README file. Contents will be displayed on the package homepage on npmjs.com and repo homepage of github.com
- `tsconfig.json`: Base TypeScript config. Used when developing
- `tsconfig.build.json`: TypeScript config used when building, emits build artifacts within `dist`
- `dist`: Directory containing generated files. The contents of this directory is published
- `.github/workflows/ci.yml`: GitHub action that runs typechecks, tests and build

## Roadmap

- [ ] Installer similar to T3 app and Create React App
- [ ] Multiple output formats (esm, cjs, mjs)
- [ ] Choose between tools (Jest vs Vitest)

## Credits and inspiration

- [tsup](https://github.com/egoist/tsup)
- [tsdx](https://github.com/jaredpalmer/tsdx)
- [microbundle](https://github.com/developit/microbundle)
