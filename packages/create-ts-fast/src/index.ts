#!/usr/bin/env node

// Modified from: https://github.com/vitejs/vite/blob/main/packages/create-vite/src/index.ts

import minimist from 'minimist';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import prompts from 'prompts';

const { red, reset, white } = chalk;

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

// TODO: read from file system
const TEMPLATES = ['universal', 'react-hooks'];

async function main() {
  const argTargetDir = formatTargetDir(argv._[0]);
  const argTemplate = argv.template || argv.t;

  let targetDir = argTargetDir || defaultTargetDir;
  const getProjectName = () => path.basename(path.resolve(targetDir));

  let result: prompts.Answers<
    'projectName' | 'overwrite' | 'packageName' | 'template'
  >;

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir;
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmptyDir(targetDir)
              ? null
              : 'select',
          name: 'overwrite',
          message: () =>
            (targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`) +
            ` is not empty. Please choose how to proceed:`,
          initial: 0,
          choices: [
            {
              title: 'Cancel operation',
              value: 'no',
            },
            {
              title: 'Remove existing files and continue',
              value: 'yes',
            },
            {
              title: 'Ignore files and continue',
              value: 'ignore',
            },
          ],
        },
        {
          type: (_, { overwrite }: { overwrite?: string }) => {
            if (overwrite === 'no') {
              throw new Error(red('✖') + ' Operation cancelled');
            }
            return null;
          },
          name: 'overwriteChecker',
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type:
            argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
          name: 'template',
          message:
            typeof argTemplate === 'string' && !TEMPLATES.includes(argTemplate)
              ? reset(
                  `"${argTemplate}" isn't a valid template. Please choose from below: `,
                )
              : reset('Select a template:'),
          initial: 0,
          choices: TEMPLATES.map((template) => {
            return {
              title: white(template),
              value: template,
            };
          }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled');
        },
      },
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  // User choice associated with prompts
  const { template, overwrite, packageName } = result;

  const root =
    process.env.npm_lifecycle_event === 'dev'
      ? path.join(cwd, '__scaffold__', targetDir)
      : path.join(cwd, targetDir);

  if (overwrite === 'yes') {
    rmdir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm';

  console.log(`\nScaffolding project in ${root}...`);

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

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((file_) => file_ !== 'package.json')) {
    write(file);
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
  );

  pkg.name = packageName || getProjectName();
  pkg.version = '0.0.0';
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
  console.log(`\nDone. Now run:\n`);

  if (root !== cwd) {
    console.log(
      `  cd ${
        cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`,
    );
  }
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn');
      console.log('  yarn dev');
      break;
    default:
      console.log(`  ${pkgManager} install`);
      console.log(`  ${pkgManager} run dev`);
      break;
  }
  console.log();

  process.exit(0);
}

try {
  await main();
} catch (err) {
  console.error('Aborting installation...');
  if (err instanceof Error) {
    console.error(err);
  } else {
    console.error(
      'An unknown error has occurred. Please open a GitHub issue with the following:',
    );
    console.log(err);
  }

  process.exit(1);
}

export {};

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '');
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  );
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-');
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isEmptyDir(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) {
    return undefined;
  }

  const pkgSpec = userAgent.split(' ')[0];
  const pkgSpecArr = pkgSpec.split('/');

  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

function rmdir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue;
    }

    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}
