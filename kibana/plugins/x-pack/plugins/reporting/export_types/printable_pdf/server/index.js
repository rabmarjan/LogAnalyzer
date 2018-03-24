import { createJobFactory } from './create_job';
import { executeJobFactory } from './execute_job';
import { initFactory } from './init';
import { metadata } from '../metadata';

export function register(registry) {
  registry.register({
    ...metadata,
    jobType: 'printable_pdf',
    jobContentEncoding: 'base64',
    createJobFactory,
    executeJobFactory,
    initFactory,
    validLicenses: ['trial', 'standard', 'gold', 'platinum'],
  });
}
