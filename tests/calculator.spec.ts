import { expect } from '@wdio/globals';
import allure from '@wdio/allure-reporter';
import { CalculatorScreen } from '../src/screens/CalculatorScreen.js';
import { calculatorFixtures } from '../src/fixtures/calculatorFixtures.js';
import { apps } from '../config/apps.js';
import { AppHelper } from '../src/helpers/AppHelper.js';

describe('Calculator', () => {
  let calc: CalculatorScreen;

  before(() => {
    calc = new CalculatorScreen();
  });

  beforeEach(async () => {
    await AppHelper.forceRestartActivity(apps.calculator);
  });

  it('TC01 - addition shows correct result in preview', async () => {
    allure.addFeature('Basic Arithmetic');
    allure.addSeverity('critical');
    allure.addStory('Addition');

    const { operands, expectedResult } = calculatorFixtures.addition;

    await calc.tapDigit(operands[0]);
    await calc.tapAdd();
    await calc.tapDigit(operands[1]);

    expect(await calc.getResultPreview()).toBe(expectedResult);
  });

  it('TC02 - multiplication shows correct result in preview', async () => {
    allure.addFeature('Basic Arithmetic');
    allure.addSeverity('critical');
    allure.addStory('Multiplication');

    const { operands, expectedResult } = calculatorFixtures.multiplication;

    await calc.tapDigit(operands[0]);
    await calc.tapMul();
    await calc.tapDigit(operands[1]);

    expect(await calc.getResultPreview()).toBe(expectedResult);
  });

  it('TC03 - subtraction shows correct result in preview', async () => {
    allure.addFeature('Basic Arithmetic');
    allure.addSeverity('normal');
    allure.addStory('Subtraction');

    const { operands, expectedResult } = calculatorFixtures.subtraction;

    await calc.tapDigit(operands[0]);
    await calc.tapSub();
    await calc.tapDigit(operands[1]);

    expect(await calc.getResultPreview()).toBe(expectedResult);
  });
});
