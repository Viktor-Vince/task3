export interface CalcOperation {
  operands: [string, string];
  expectedResult: string;
}

export const calculatorFixtures = {
  addition: {
    operands: ['5', '3'],
    expectedResult: '8',
  },

  multiplication: {
    operands: ['6', '7'],
    expectedResult: '42',
  },

  subtraction: {
    operands: ['9', '4'],
    expectedResult: '5',
  },
} as const satisfies Record<string, CalcOperation>;
