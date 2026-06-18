import type { AppDefinition } from '../../config/apps.js';

export class AppHelper {
  static async clearAndOpen(pkg: string): Promise<void> {
    await browser.execute('mobile: shell', { command: 'pm', args: ['clear', pkg] });
    await browser.execute('mobile: activateApp', { appId: pkg });
    await browser.pause(1000);
  }

  static async forceRestartActivity(app: AppDefinition): Promise<void> {
    await browser.execute('mobile: shell', { command: 'am', args: ['force-stop', app.package] });
    await browser.execute('mobile: shell', { command: 'am', args: ['start', '-n', `${app.package}/${app.activity}`] });
    await browser.pause(1500);
  }
}
