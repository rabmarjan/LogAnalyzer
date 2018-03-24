import { AWS } from './aws';
import { AZURE } from './azure';
import { GCP } from './gcp';

/**
 * An iteratable that can be used to loop across all known cloud services to detect them.
 *
 * @type {Array}
 */
export const CLOUD_SERVICES = [ AWS, GCP, AZURE ];
