import fs from 'fs';
import path from 'path';
import { promisify } from 'bluebird';
import { extract } from '../extract';
import * as chromium from './chromium';
import * as phantom from './phantom';

export const browsers = {
  chromium,
  phantom
};

const fsp = {
  access: promisify(fs.access, fs),
  chmod: promisify(fs.chmod, fs),
};

export async function installBrowser(browserType, installsPath) {
  const browser = browsers[browserType];
  const pkg = browser.paths.packages.find(p => p.platforms.includes(process.platform));
  if (!pkg) {
    throw new Error('Unsupported platform: platform');
  }

  const binaryPath = path.join(installsPath, pkg.binaryRelativePath);
  try {
    await fsp.access(binaryPath, fs.X_OK);
  } catch (accessErr) {
    // error here means the binary does not exist, so install it
    const archive = path.join(browser.paths.archivesPath, pkg.archiveFilename);
    await extract(archive, installsPath);
    await fsp.chmod(binaryPath, '755');
  }

  return browser.createDriverFactory(binaryPath);
}