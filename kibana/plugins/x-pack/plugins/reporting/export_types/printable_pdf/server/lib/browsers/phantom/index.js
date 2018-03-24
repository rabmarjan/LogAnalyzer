import { PhantomDriverFactory } from './driver_factory';

export { paths } from './paths';

export async function createDriverFactory(binaryPath) {
  return new PhantomDriverFactory(binaryPath);
}
