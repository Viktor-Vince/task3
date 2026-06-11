import path from 'path';
import os from 'os';
import { resolveDevices } from './config/devices.js';

process.env.ANDROID_HOME = path.join(os.homedir(), 'AppData', 'Local', 'Android', 'Sdk');
process.env.ANDROID_SDK_ROOT = process.env.ANDROID_HOME;

const profiles = resolveDevices(process.env.DEVICE);
console.log(`Running on: ${profiles.map(p => p.name).join(', ')}`);

export const config: WebdriverIO.Config = {
  runner: 'local',

  port: parseInt(process.env.APPIUM_PORT ?? '4723'),
  path: '/',

  specs: ['./tests/**/*.spec.ts'],
  maxInstances: 1,

  capabilities: profiles.map(p => ({
    ...p.caps,
    ...(p.specs ? { specs: p.specs } : {}),
  })),

  logLevel: 'warn',
  bail: 0,
  // retry each failing spec file up to 1 time — guards against transient Appium/device glitches
  specFileRetries: 1,
  // wait for device to settle before retrying
  specFileRetriesDelay: 3,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [['appium', { command: 'appium', args: { relaxedSecurity: true, port: parseInt(process.env.APPIUM_PORT ?? '4723') } }]],

  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 90000 },

  afterTest: async function (_test, _ctx, { error }) {
    if (error) {
      await browser.takeScreenshot();
    }
  },

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
};
