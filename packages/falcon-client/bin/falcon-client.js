#!/usr/bin/env node
const Logger = require('@deity/falcon-logger');
const webpack = require('./../src/buildTools/webpack');
const workbox = require('./../src/buildTools/workbox');
const jest = require('./../build-utils/jest/test');
const { failIfAppEntryFilesNotFound } = require('./../src/buildTools');

(async () => {
  const script = process.argv[2];
  // const args = process.argv.slice(3);

  try {
    switch (script) {
      case 'start': {
        failIfAppEntryFilesNotFound();
        await webpack.startDevServer();
        break;
      }
      case 'build': {
        failIfAppEntryFilesNotFound();
        await webpack.build();
        await workbox.injectManifest();
        break;
      }
      case 'test': {
        jest();
        break;
      }
      default:
        Logger.log(`Unknown script "${script}".`);
        Logger.log('Perhaps you need to update @deity/falcon-client?');
        process.exit();

        break;
    }
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
})();
