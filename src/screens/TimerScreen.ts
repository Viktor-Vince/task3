import { BaseScreen } from './BaseScreen.js';

const SELECTORS = {
  tab: 'android=new UiSelector().resourceId("com.google.android.deskclock:id/tab_menu_timer")',
  display: 'android=new UiSelector().resourceId("com.google.android.deskclock:id/timer_setup_time")',
  key: (digit: string) => {
    const suffix = digit === '00' ? 'digit_00' : `digit_${digit}`;
    return `android=new UiSelector().resourceId("com.google.android.deskclock:id/timer_setup_${suffix}")`;
  },
  delete: 'android=new UiSelector().resourceId("com.google.android.deskclock:id/timer_setup_delete")',
} as const;

export class TimerScreen extends BaseScreen {
  async open(): Promise<void> {
    await this.tap(SELECTORS.tab);
  }

  async tapDigit(digit: string): Promise<void> {
    await this.tap(SELECTORS.key(digit));
  }

  async tapDelete(): Promise<void> {
    await this.tap(SELECTORS.delete);
  }

  async getDisplayText(): Promise<string> {
    return this.getText(SELECTORS.display);
  }
}
