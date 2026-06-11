type DeviceCapabilities = WebdriverIO.Capabilities & {
  'appium:udid'?: string;
  'appium:deviceName'?: string;
  'appium:platformVersion': string;
  'appium:automationName': string;
  'appium:noReset': boolean;
  'appium:ignoreHiddenApiPolicyError'?: boolean;
};

export interface DeviceProfile {
  name: string;
  caps: DeviceCapabilities;
  // when defined, only these specs run on this device; otherwise all specs run
  specs?: string[];
}

export const devices: Record<string, DeviceProfile> = {
  emulator: {
    name: 'Android Emulator',
    caps: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'emulator-5554',
      'appium:platformVersion': '14',
      'appium:noReset': true,
    },
    specs: ['./tests/timer.spec.ts'],
  },

  lenovo_m10: {
    name: 'Lenovo Tab M10 FHD Plus (Android 10)',
    caps: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:udid': 'HA1GDL07',
      'appium:platformVersion': '10',
      'appium:noReset': true,
      'appium:ignoreHiddenApiPolicyError': true,
    },
    specs: ['./tests/timer.spec.ts', './tests/calculator.spec.ts'],
  },

  // redmi_note8: { // tried really hard but MIUI wins...
  //   name: 'Redmi Note 8 (Android 11, MIUI 12.5)',
  //   caps: {
  //     platformName: 'Android',
  //     'appium:automationName': 'UiAutomator2',
  //     'appium:udid': '1ee5d7df',
  //     'appium:platformVersion': '11',
  //     'appium:noReset': true,
  //     'appium:ignoreHiddenApiPolicyError': true,
  //   },
  // },
};

export function resolveDevices(deviceEnv?: string): DeviceProfile[] {
  if (!deviceEnv || deviceEnv === 'all') {
    return Object.values(devices);
  }
  const profile = devices[deviceEnv];
  if (!profile) {
    throw new Error(
      `Unknown device "${deviceEnv}". Available: ${Object.keys(devices).join(', ')}`
    );
  }
  return [profile];
}
