import { HeadlessChromiumDriverFactory } from './driver_factory';

export { paths } from './paths';

export async function createDriverFactory(binaryPath) {
  return new HeadlessChromiumDriverFactory(binaryPath);
}
