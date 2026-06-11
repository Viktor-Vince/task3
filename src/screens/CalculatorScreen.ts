import { BaseScreen } from './BaseScreen.js';

const pkg = 'com.google.android.calculator';

const SELECTORS = {
  formula:       `android=new UiSelector().resourceId("${pkg}:id/formula")`,
  resultPreview: `android=new UiSelector().resourceId("${pkg}:id/result_preview")`,
  clear:         `android=new UiSelector().resourceId("${pkg}:id/clr")`,
  delete:        `android=new UiSelector().resourceId("${pkg}:id/del")`,
  equals:        `android=new UiSelector().resourceId("${pkg}:id/eq")`,
  digit: (n: string) => `android=new UiSelector().resourceId("${pkg}:id/digit_${n}")`,
  op: (op: 'add' | 'sub' | 'mul' | 'div') =>
    `android=new UiSelector().resourceId("${pkg}:id/op_${op}")`,
} as const;

export class CalculatorScreen extends BaseScreen {
  async clear():              Promise<void>   { await this.tap(SELECTORS.clear); }
  async tapDigit(n: string):  Promise<void>   { await this.tap(SELECTORS.digit(n)); }
  async tapAdd():             Promise<void>   { await this.tap(SELECTORS.op('add')); }
  async tapSub():             Promise<void>   { await this.tap(SELECTORS.op('sub')); }
  async tapMul():             Promise<void>   { await this.tap(SELECTORS.op('mul')); }
  async tapDiv():             Promise<void>   { await this.tap(SELECTORS.op('div')); }
  async tapEquals():          Promise<void>   { await this.tap(SELECTORS.equals); }
  async getFormula():         Promise<string> { return this.getText(SELECTORS.formula); }
  async getResultPreview():   Promise<string> { return this.getText(SELECTORS.resultPreview); }
}
