export abstract class BaseScreen {
  protected async waitForDisplayed(selector: string) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout: 10000 });
    return el;
  }

  protected async tap(selector: string): Promise<void> {
    const el = await this.waitForDisplayed(selector);
    await el.click();
  }

  protected async getText(selector: string): Promise<string> {
    const el = await this.waitForDisplayed(selector);
    return el.getText();
  }
}
