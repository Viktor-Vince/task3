import { expect } from '@wdio/globals';
import allure from '@wdio/allure-reporter';
import { TimerScreen } from '../src/screens/TimerScreen.js';
import { timerFixtures } from '../src/fixtures/timerFixtures.js';
import { apps } from '../config/apps.js';

describe('Timer', () => {
  let timer: TimerScreen;

  before(() => {
    timer = new TimerScreen();
  });

  beforeEach(async () => {
    await browser.execute('mobile: shell', { command: 'pm', args: ['clear', apps.clock.package] });
    await browser.execute('mobile: activateApp', { appId: apps.clock.package });
    await browser.pause(1000);
    await timer.open();
  });

  it('TC01 - entering digits updates the timer display', async () => {
    allure.addFeature('Timer Setup');
    allure.addSeverity('critical');
    allure.addStory('Digit input');

    const { digits, expectedDisplay } = timerFixtures.oneMinuteFiftySeconds;

    for (const digit of digits) await timer.tapDigit(digit);

    expect(await timer.getDisplayText()).toBe(expectedDisplay);
  });

  it('TC02 - backspace clears entered digits one by one', async () => {
    allure.addFeature('Timer Setup');
    allure.addSeverity('normal');
    allure.addStory('Digit input');

    const { expectedDisplay: emptyDisplay } = timerFixtures.empty;
    const { digits: inputDigits } = timerFixtures.oneMinuteFiftySeconds;

    for (const digit of inputDigits) await timer.tapDigit(digit);
    for (let i = 0; i < inputDigits.length; i++) await timer.tapDelete();

    expect(await timer.getDisplayText()).toBe(emptyDisplay);
  });

  // TC03 is intentionally expected to fail — demonstrates Allure failure reporting
  // (screenshot, stack trace). The display shows "00h 01m 50s" but we assert "99h 99m 99s".
  it('TC03 - [EXPECTED TO FAIL] wrong expected value to demonstrate failure reporting', async () => {
    allure.addFeature('Timer Setup');
    allure.addSeverity('trivial');
    allure.addStory('Failure reporting demo');

    const { digits } = timerFixtures.oneMinuteFiftySeconds;

    for (const digit of digits) await timer.tapDigit(digit);

    expect(await timer.getDisplayText()).toBe('99h 99m 99s');
  });
});
