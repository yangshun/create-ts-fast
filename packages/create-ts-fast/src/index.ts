#!/usr/bin/env node

async function main() {
  console.log('Hello world!');
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
