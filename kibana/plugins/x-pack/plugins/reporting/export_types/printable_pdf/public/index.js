import './options';
import { JobParamsProvider } from './job_params_provider';
import { metadata } from '../metadata';

export function register(registry) {
  registry.register({
    ...metadata,
    JobParamsProvider,
    optionsTemplate: `<pdf-options />`
  });
}
