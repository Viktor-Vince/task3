export interface AppDefinition {
  package: string;
  activity: string;
}

export const apps = {
  clock: {
    package: 'com.google.android.deskclock',
    activity: 'com.android.deskclock.DeskClock',
  },

  calculator: {
    package: 'com.google.android.calculator',
    activity: 'com.android.calculator2.Calculator',
  },
} as const satisfies Record<string, AppDefinition>;
