# npm TypeScript Boilerplate

Unopinionated boilerplate for creating npm packages in TypeScript. Contains just enough features to help you author and publish a TypeScript-based npm package in under 15 minutes.

Features:

- Zero `dependencies`, minimal `devDependencies`:
  - [TypeScript](https://www.typescriptlang.org/): Modern, de facto flavor of JavaScript
  - [Vitest](https://vitest.dev/): Next generation testing framework with out-of-the-box TypeScript support. Easily replace this with Jest should you wish to

This is not a library. You're supposed to clone this repository, use it as a **starting point** and customize it to your liking.

This boilerplate does not have opinions on the following:

- Alternative package managers, e.g. pnpm, Yarn
- Linting, e.g. ESLint, Biome
- Formatting, e.g Prettier, Biome
- Alternative runtimes e.g. Bun, Deno

Why? Because there are a number to choose from and you can easily add them yourself. If/when one of them becomes the standard (e.g. how TypeScript has won), then we can including them as part of the boilerplate.

## How to use

1. Clone this repository
2. Implement your library within `src`
3. Modify `package.json` – update `name` and `author` and any relevant fields
4. Update `README.md`
5. `npm run publish`
6. Profit!

## Commands

- `npm run check`: Checks code within `src` for TypeScript issues. No artifacts are generated
- `npm test`: Single test run using Vitest
- `npm test:watch`: Watch mode. Runs all test suites and reruns them when there are changes
- `npm run build`: Compiles `src` into JavaScript and TypeScript definitions into `dist` directory
- `npm run ci`: Checks code + runs test + build. Suitable for running in CI environments
- `npm run clean`: Deletes the `dist` directory
- `npm run release`: Publish to npm directory. Published only if `npm run ci` is successful

## Directory walkthrough

```
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
