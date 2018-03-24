import { cpus } from 'os';

const defaultCPUCount = 2;

function cpuCount() {
  try {
    return cpus().length;
  } catch (e) {
    return defaultCPUCount;
  }
}

export const config = {
  concurrency: cpuCount()
};
