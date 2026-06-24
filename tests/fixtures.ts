import { test as base, _electron as electron } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';
import path from 'path';

type Fixtures = {
  app: ElectronApplication;
  page: Page;
};

const APP_DIR = path.resolve(__dirname, '..');

const electronBin = path.join(
  APP_DIR, 'node_modules', 'electron', 'dist',
  process.platform === 'win32' ? 'electron.exe' : 'electron',
);

export const test = base.extend<Fixtures>({
  app: async ({}, use) => {
    const env = { ...process.env };
    delete env.ELECTRON_RUN_AS_NODE;

    const app = await electron.launch({
      executablePath: electronBin,
      args: ['dist/infrastructure/main.js'],
      cwd: APP_DIR,
      env,
    });

    await use(app);
    await app.close().catch(() => {});
  },

  page: async ({ app }, use) => {
    const page = await app.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },
});

export { expect } from '@playwright/test';
