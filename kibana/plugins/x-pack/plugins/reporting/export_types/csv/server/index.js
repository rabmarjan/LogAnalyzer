import { createJobFactory } from './create_job';
import { executeJobFactory } from './execute_job';
import { metadata } from '../metadata';

export function register(registry) {
  registry.register({
    ...metadata,
    jobType: 'csv',
    createJobFactory,
    executeJobFactory,
    validLicenses: ['trial', 'basic', 'standard', 'gold', 'platinum'],
  });
}
