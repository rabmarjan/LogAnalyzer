import path from 'path';

export const paths = {
  archivesPath: path.join(__dirname, '..', '..', '', '..', '..', '..', '..', '.chromium'),
  baseUrl: 'https://s3.amazonaws.com/headless-shell/',
  packages: [{
    platforms: ['darwin', 'freebsd', 'openbsd'],
    archiveFilename: 'chromium-503a3e4-darwin.zip',
    archiveChecksum: 'c1b530f99374e122c0bd7ba663867a95',
    binaryRelativePath: 'headless_shell-darwin/headless_shell',
  }, {
    platforms: ['linux'],
    archiveFilename: 'chromium-503a3e4-linux.zip',
    archiveChecksum: '9486d8eff9fc4f94c899aa72f5e59520',
    binaryRelativePath: 'headless_shell-linux/headless_shell'
  }, {
    platforms: ['win32'],
    archiveFilename: 'chromium-503a3e4-win32.zip',
    archiveChecksum: 'a71ce5565791767492f6d0fb4fe5360d',
    binaryRelativePath: 'headless_shell-win32\\headless_shell.exe'
  }]
};