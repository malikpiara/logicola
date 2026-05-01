import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { visualRoutes, visualViewports } from './visual-routes.mjs';

const mode = process.argv[2] ?? 'current';
const baseUrl = process.env.VISUAL_BASE_URL ?? 'http://127.0.0.1:3000';
const outputDir = path.resolve('artifacts/visual', mode);

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function main() {
  if (!['baseline', 'current'].includes(mode)) {
    throw new Error(`Unsupported capture mode "${mode}"`);
  }

  await ensureDir(outputDir);

  const browser = await chromium.launch();

  try {
    for (const viewport of visualViewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme: 'light',
        reducedMotion: 'reduce',
      });

      for (const entry of visualRoutes) {
        const page = await context.newPage();
        const targetUrl = new URL(entry.route, baseUrl).toString();

        await page.goto(targetUrl, {
          waitUntil: 'networkidle',
          timeout: 30_000,
        });
        await page.waitForTimeout(1_000);
        await page.addStyleTag({
          content:
            '*,:before,:after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}',
        });

        const filename = `${entry.name}-${viewport.name}.png`;
        await page.screenshot({
          path: path.join(outputDir, filename),
        });

        console.log(`Captured ${filename}`);
        await page.close();
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
