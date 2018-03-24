import chrome from 'ui/chrome';

import $ from 'jquery';

export function putLicense(license, acknowledge) {
  const options = {
    url: `${chrome.addBasePath('/api/license')}${acknowledge ? '?acknowledge=true' : ''}`,
    data: license,
    contentType: 'application/json',
    cache: false,
    crossDomain: true,
    type: 'PUT',
  };

  return $.ajax(options);
}

