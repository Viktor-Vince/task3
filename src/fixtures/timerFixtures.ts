export interface TimerEntry {
  digits: string[];
  expectedDisplay: string;
}

export const timerFixtures = {
  oneMinuteFiftySeconds: {
    digits: ['1', '5', '0'],
    expectedDisplay: '00h 01m 50s',
  },

  tenMinutes: {
    digits: ['1', '0', '0', '0'],
    expectedDisplay: '00h 10m 00s',
  },

  oneHour: {
    digits: ['3', '6', '0', '0', '0'],
    expectedDisplay: '01h 00m 00s',
  },

  empty: {
    digits: [],
    expectedDisplay: '00h 00m 00s',
  },
} as const satisfies Record<string, TimerEntry>;
