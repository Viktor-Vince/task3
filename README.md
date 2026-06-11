# Mobile Test Suite — Android Timer & Calculator

Automated mobile tests for Android apps using [WebdriverIO](https://webdriver.io/) v9 + [Appium](https://appium.io/) 2 + TypeScript.

Covers two apps across two devices. Per-device spec filtering handles platform differences — e.g. Google Calculator works on the Lenovo tablet without a Google account but triggers GMS sign-in on the emulator, so calculator tests are mapped to the tablet only.

## Prerequisites

### 1. Java JDK 17+
Download from [adoptium.net](https://adoptium.net) and set `JAVA_HOME`:
```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17", "Machine")
```

### 2. Android Studio + SDK
1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Install with default settings (includes Android SDK)
3. Set environment variables:
```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "Machine")
[System.Environment]::SetEnvironmentVariable("PATH", "$env:PATH;$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\emulator", "Machine")
```

### 3. Appium UiAutomator2 driver
```bash
npm install   # installs appium from package.json
npx appium driver install uiautomator2
```

## Setup

```bash
npm install
```

## Running tests

### Emulator

```bash
# Start emulator first (find your AVD name with: emulator -list-avds)
emulator -avd <your_avd_name> -no-snapshot-load

npm run test:emulator
```

Runs: `timer.spec.ts` only — Calculator triggers Google sign-in on the emulator.

### Real device — Lenovo Tab M10 FHD Plus

1. Enable **Developer Options** on the device
2. Turn on **USB Debugging**
3. Connect via USB and verify:
```bash
adb devices
```
4. Make sure the device ID matches the `lenovo_m10` entry in `config/devices.ts`
5. Run:
```bash
npm run test:lenovo
```

Runs: `timer.spec.ts` + `calculator.spec.ts`

### All devices — sequential

```bash
npm run test:all
```

Each device runs its own spec subset one after another. Safe default — no port conflicts.

### All devices — parallel

```bash
npm run test:parallel
```

Each device gets its own `wdio` process and its own Appium server on a dedicated port. Processes run in parallel via `npm-run-all`; within each device, spec files execute sequentially. Requires all devices to be connected at the same time.

| Process | Port | Specs |
|---------|------|-------|
| `test:emulator` | 4723 | timer |
| `test:lenovo` | 4724 | timer → calculator |

> **Why separate processes?** A single WebdriverIO process with multiple devices shares one worker pool. When a device has 2 spec files and a worker slot frees up, WebdriverIO may assign the second spec to the same device while the first is still running — causing UiAutomator2 instrumentation conflicts. Separate `wdio` processes eliminate shared state entirely.

### Ad-hoc

```bash
cross-env DEVICE=lenovo_m10 npm test
cross-env DEVICE=emulator npm test
cross-env DEVICE=all PARALLEL=true npm test
```

### Allure report

```bash
npm run test:report
```

## Test cases

### Timer (`com.google.android.deskclock`) — all devices

| ID | Description | Severity | Expected result |
|----|-------------|----------|-----------------|
| TC01 | Entering digits updates the display | critical | Tapping 1→5→0 shows `00h 01m 50s` |
| TC02 | Backspace clears entered digits one by one | normal | After 1→5→0 and 3× delete, display resets to `00h 00m 00s` |
| TC03 | *(intentional failure)* Wrong assertion | trivial | Demonstrates Allure failure report — screenshot + stack trace |

### Calculator (`com.google.android.calculator`) — Lenovo tablet only

| ID | Description | Severity | Expected result |
|----|-------------|----------|-----------------|
| TC01 | Addition shows correct result in preview | critical | `5 + 3` → preview shows `8` |
| TC02 | Multiplication shows correct result in preview | critical | `6 × 7` → preview shows `42` |
| TC03 | Pressing equals confirms the result | normal | `9 − 4 =` → formula shows `5` |

## Project structure

```
config/
├── devices.ts          # device registry — hardware caps + per-device spec list
└── apps.ts             # app package/activity definitions
src/
├── screens/
│   ├── BaseScreen.ts         # shared waitForDisplayed / tap / getText helpers
│   ├── TimerScreen.ts        # Timer setup screen
│   └── CalculatorScreen.ts   # Calculator screen
└── fixtures/
    ├── timerFixtures.ts      # timer test data
    └── calculatorFixtures.ts # calculator test data
tests/
├── timer.spec.ts       # TC01–TC03 for Timer
└── calculator.spec.ts  # TC01–TC03 for Calculator
wdio.conf.ts            # WebdriverIO + Appium config (reads DEVICE / PARALLEL env vars)
```

## Allure annotations

Each test is tagged with three labels visible in the Allure report:

| Label | Values used |
|-------|-------------|
| **Feature** | `Timer Setup`, `Basic Arithmetic` |
| **Severity** | `critical`, `normal`, `trivial` |
| **Story** | `Digit input`, `Addition`, `Multiplication`, `Result confirmation`, `Failure reporting demo` |

Labels enable filtering in the Allure UI — e.g. show only `critical` tests, or all tests under `Basic Arithmetic`. Severity is also reflected in the test case table above.

## Adding a new device

Add an entry to `config/devices.ts`:

```ts
pixel_9: {
  name: 'Pixel 9 (Android 15)',
  caps: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:udid': 'YOUR_DEVICE_ID',   // from: adb devices
    'appium:platformVersion': '15',
    'appium:noReset': true,
  },
  specs: ['./tests/timer.spec.ts'],    // declare which specs this device supports
},
```

Then run with `DEVICE=pixel_9 npm test` or add a dedicated script to `package.json`.

## Adding a new app

Add an entry to `config/apps.ts`:

```ts
settings: {
  package: 'com.android.settings',
  activity: '.Settings',
},
```

Then create `src/screens/SettingsScreen.ts` extending `BaseScreen`, reference `apps.settings` in your spec's `beforeEach`, and add the spec path to whichever device profiles should run it.

## Design patterns

- **Screen Object Pattern** — selectors and actions encapsulated per screen; tests contain only orchestration
- **Base Screen** — shared `tap`, `getText`, `waitForDisplayed` eliminate duplication across screens
- **Device registry with per-device specs** — each profile in `config/devices.ts` declares which specs it supports; `wdio.conf.ts` passes them as capability-level `specs`, letting WebdriverIO filter automatically without any conditional logic in test code
- **App registry** — `config/apps.ts` centralises package names and activities; specs reference `apps.clock` / `apps.calculator` instead of hardcoded strings
- **Data-driven tests** — all input values and expected results live in `src/fixtures/` typed with `satisfies`; changing app behaviour requires only a fixture update
- **Allure annotations** — each test declares `feature`, `severity`, and `story` via `@wdio/allure-reporter`; enables filtering by priority or functional area in the Allure UI
- **Screenshot on failure** — `afterTest` hook captures a screenshot automatically; attached to the Allure report for every failed test
- **Retry on flakiness** — `specFileRetries: 1` reruns a failing spec file after a 3 s delay, guarding against transient Appium/device glitches; uses spec-file level (not test level) retry so `before`/`beforeEach` hooks re-execute cleanly
- **Parallel execution** — `PARALLEL=true` sets `maxInstances` to the number of active device profiles; sequential mode is the safe default
