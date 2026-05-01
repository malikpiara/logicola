import fs from 'node:fs/promises';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const baselineDir = path.resolve('artifacts/visual/baseline');
const currentDir = path.resolve('artifacts/visual/current');
const diffDir = path.resolve('artifacts/visual/diff');
const allowedDiffPixels = Number(process.env.VISUAL_MAX_DIFF_PIXELS ?? '0');

async function readPng(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  return PNG.sync.read(fileBuffer);
}

async function compareFile(filename) {
  const baseline = await readPng(path.join(baselineDir, filename));
  const current = await readPng(path.join(currentDir, filename));

  if (
    baseline.width !== current.width ||
    baseline.height !== current.height
  ) {
    throw new Error(`Dimension mismatch for ${filename}`);
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const diffPixels = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    baseline.width,
    baseline.height,
    {
      threshold: 0.1,
    }
  );

  await fs.mkdir(diffDir, { recursive: true });
  await fs.writeFile(path.join(diffDir, filename), PNG.sync.write(diff));

  return diffPixels;
}

async function main() {
  const baselineFiles = (await fs.readdir(baselineDir)).filter((file) =>
    file.endsWith('.png')
  );

  if (baselineFiles.length === 0) {
    throw new Error('No baseline screenshots found.');
  }

  let hasFailure = false;

  for (const filename of baselineFiles) {
    const currentPath = path.join(currentDir, filename);

    try {
      await fs.access(currentPath);
    } catch {
      console.error(`Missing current screenshot for ${filename}`);
      hasFailure = true;
      continue;
    }

    const diffPixels = await compareFile(filename);
    const status = diffPixels <= allowedDiffPixels ? 'PASS' : 'FAIL';

    console.log(`${status} ${filename}: ${diffPixels} diff pixels`);

    if (diffPixels > allowedDiffPixels) {
      hasFailure = true;
    }
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
