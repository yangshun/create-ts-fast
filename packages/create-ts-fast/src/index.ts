#!/usr/bin/env node

// Stolen from https://github.com/vitejs/vite/blob/main/packages/create-vite/src/index.ts
import minimist from 'minimist';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import {
  copy,
  formatTargetDir,
  isEmptyDir,
  isValidPackageName,
  pkgFromUserAgent,
  rmdirPreserveGit,
  toValidPackageName,
} from './utils';

const argv = minimist<{
  template?: string;
}>(process.argv.slice(2), {
  default: { help: false },
  alias: { t: 'template' },
  string: ['_'],
});
const cwd = process.cwd();

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
};

const defaultTargetDir = 'ts-fast-project';

// Sync with templates dir
type Template = 'universal' | 'cli' | 'react-hooks';
const templateOptions: Record<
  Template,
  Readonly<{ label: string; value: Template; hint: string }>
> = {
  universal: {
    label: 'Universal utility',
    value: 'universal',
    hint: 'Runs on both client and server, e.g. axios, clsx, lodash, zod',
  },
  cli: {
    label: 'Command line utility',
    value: 'cli',
    hint: 'Runs in the terminal, e.g. eslint, tsc, vite, jest',
  },
  'react-hooks': {
    label: 'React hooks',
    value: 'react-hooks',
    hint: 'Custom React hooks, e.g. react-use, usehooks-ts',
  },
};
const templateValues = Object.values(templateOptions).map(({ value }) => value);

type PromptResults = {
  overwrite: 'no' | 'yes' | 'ignore';
  packageName: string;
  template: string;
};

async function main() {
  const argTargetDir = formatTargetDir(argv._[0]);
  const argTemplate = argv.template || argv.t;

  function normalizeTargetDir(dir: string) {
    return process.env.npm_lifecycle_event === 'dev'
      ? path.join('__scaffold__', dir)
      : path.join(dir);
  }

  let targetDir = normalizeTargetDir(argTargetDir || defaultTargetDir);
  function getProjectName() {
    return path.basename(path.resolve(targetDir));
  }

  let results: PromptResults = {
    overwrite: 'no',
    packageName: getProjectName(),
    template: '',
  };

  try {
    if (!argTargetDir) {
      const targetDirResponse = await p.text({
        message: 'Enter your project name',
        placeholder: 'my-ts-project',
      });

      if (p.isCancel(targetDirResponse)) {
        p.cancel('Operation cancelled.');
        process.exit(1);
      }

      targetDir = normalizeTargetDir(
        formatTargetDir(targetDirResponse) || defaultTargetDir,
      );
    }

    if (fs.existsSync(targetDir) && !isEmptyDir(targetDir)) {
      const overwriteResponse = await p.select<PromptResults['overwrite']>({
        message:
          (targetDir === '.'
            ? 'Current directory'
            : `Target directory "${targetDir}"`) +
          ' is not empty. Please choose how to proceed:',
        initialValue: results.overwrite,
        options: [
          {
            label: 'Cancel operation',
            value: 'no',
          },
          {
            label: 'Remove existing files and continue',
            value: 'yes',
          },
          {
            label: 'Ignore files and continue',
            value: 'ignore',
          },
        ],
      });

      if (p.isCancel(overwriteResponse) || overwriteResponse === 'no') {
        p.cancel('Operation cancelled.');
        process.exit(1);
      }

      results.overwrite = overwriteResponse;
    }

    if (!isValidPackageName(getProjectName())) {
      const packageNameResponse = await p.text({
        message: 'Package name',
        initialValue: toValidPackageName(getProjectName()),
        validate: (pkgName) =>
          isValidPackageName(pkgName) ? undefined : 'Invalid package.json name',
      });

      if (p.isCancel(packageNameResponse)) {
        p.cancel('Operation cancelled.');
        process.exit(1);
      }

      results.packageName = packageNameResponse;
    }

    if (!argTemplate || !templateValues.includes(argTemplate)) {
      const templateResponse = await p.select({
        message:
          typeof argTemplate === 'string' &&
          !templateValues.includes(argTemplate as Template)
            ? `"${argTemplate}" isn't a valid template. Please choose from the following:`
            : 'Select a template:',
        options: Object.values(templateOptions),
      });

      if (p.isCancel(templateResponse)) {
        p.cancel('Operation cancelled.');
        process.exit(1);
      }

      results.template = templateResponse;
    }
  } catch (cancelled: any) {
    p.log.error(cancelled.message);
    return;
  }

  // User choice associated with prompts
  const { template, overwrite, packageName } = results;

  const root = path.join(cwd, targetDir);

  if (overwrite === 'yes') {
    rmdirPreserveGit(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  p.log.info(`Scaffolding project in ${root}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    'templates',
    template,
  );

  function write(file: string, content?: string) {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  }

  // Copy files from template to target dir
  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((file_) => file_ !== 'package.json')) {
    write(file);
  }

  // Write personalized package.json to target dir
  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
  );

  const pkgName = packageName || getProjectName();
  pkg.name = pkgName;

  pkg.version = '0.0.0';

  // Attempt to fill author field
  try {
    const name = execSync('git config user.name').toString().trim();
    const email = execSync('git config user.email').toString().trim();

    if (name) {
      pkg.author = email ? `${name} <${email}>` : name;
    }
  } catch {
    // Do nothing
  }

  write('package.json', JSON.stringify(pkg, null, 2) + '\n');

  const cdProjectName = path.relative(cwd, root);
  p.log.success('Done. Now run:');
  console.log();

  // Print installation commands
  if (root !== cwd) {
    console.log(
      `   cd ${
        cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`,
    );
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm';
  switch (pkgManager) {
    case 'yarn':
      console.log('   yarn');
      console.log('   yarn dev');
      break;
    default:
      console.log(`   ${pkgManager} install`);
      console.log(`   ${pkgManager} run dev`);
      break;
  }

  process.exit(0);
}

try {
  await main();
} catch (err) {
  p.log.error('Aborting installation...');
  if (err instanceof Error) {
    p.log.error(err.message);
  } else {
    p.log.error(
      'An unknown error has occurred. Please open a GitHub issue with the following:',
    );
    p.log.error(String(err));
  }

  process.exit(1);
}

export {};
