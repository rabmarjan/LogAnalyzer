import semver from 'semver';
import { metadata } from 'ui/metadata';

const major = semver.major(metadata.version);
const minor = semver.minor(metadata.version);

const urlVersion = `${major}.${minor}`;
const baseUrl = 'https://www.elastic.co/';

/**
 *
 * @param {string} linkTemplate Link template containing {baseUrl} and {urlVersion} placeholders
 * @return {string} Actual link, with placeholders in template replaced
 */
export function makeDocumentationLink(linkTemplate) {
  return linkTemplate
    .replace('{baseUrl}', baseUrl)
    .replace('{urlVersion}', urlVersion);
}
