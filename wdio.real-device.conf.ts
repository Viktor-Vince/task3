// Real device configuration — Redmi Note 8 (Android 11, MIUI 12.5)
//
// Prerequisites on device:
//   Developer Options → USB Debugging ON
//   Developer Options → Install via USB ON
//     (MIUI requires Xiaomi account login + SIM card for this setting)
//
// Package differs from emulator: com.android.deskclock (AOSP) vs com.google.android.deskclock (Google)
// Timer resource-id prefix must be updated accordingly in TimerScreen.ts.

import path from 'path';
import os from 'os';

process.env.ANDROID_HOME = path.join(os.homedir(), 'AppData', 'Local', 'Android', 'Sdk');
process.env.ANDROID_SDK_ROOT = process.env.ANDROID_HOME;

export const config: WebdriverIO.Config = {
  runner: 'local',

  port: 4723,
  path: '/',

  specs: ['./tests/**/*.spec.ts'],
  maxInstances: 1,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:udid': '1ee5d7df',
      'appium:platformVersion': '11',
      'appium:appPackage': 'com.android.deskclock',
      'appium:appActivity': 'com.android.deskclock.DeskClockTabActivity',
      'appium:noReset': true,
      'appium:ignoreHiddenApiPolicyError': true,
    },
  ],

  logLevel: 'warn',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [['appium', { command: 'appium', args: { relaxedSecurity: true } }]],

  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 90000 },

  afterTest: async function (_test, _ctx, { error }) {
    if (error) await browser.takeScreenshot();
  },

  reporters: [
    'spec',
    ['allure', { outputDir: 'allure-results', disableWebdriverStepsReporting: true }],
  ],
};
