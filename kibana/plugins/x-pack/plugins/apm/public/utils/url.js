import React from 'react';
import { connect } from 'react-redux';
import qs from 'querystring';
import url from 'url';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import rison from 'rison-node';

export function toQuery(search) {
  return qs.parse(search.slice(1));
}

export function fromQuery(query) {
  const encodedQuery = encodeQuery(query, ['_g', '_a']);
  return stringifyWithoutEncoding(encodedQuery);
}

export function encodeQuery(query, exclude = []) {
  return _.mapValues(query, (value, key) => {
    if (exclude.includes(key)) {
      return encodeURI(value);
    }
    return qs.escape(value);
  });
}

function stringifyWithoutEncoding(query) {
  return qs.stringify(query, null, null, {
    encodeURIComponent: v => v
  });
}

export function RelativeLinkComponent({
  location,
  path,
  query,
  disabled,
  ...props
}) {
  if (disabled) {
    return (
      <a aria-disabled="true" {...props} className={props.className || ''} />
    );
  }

  // Shorthand for pathname
  const pathname = path || _.get(props.to, 'pathname') || location.pathname;

  // Add support for querystring as object
  const search =
    query || _.get(props.to, 'query')
      ? fromQuery({
          ...toQuery(location.search),
          ...query,
          ..._.get(props.to, 'query')
        })
      : location.search;

  return (
    <Link
      {...props}
      to={{ ...location, ...props.to, pathname, search }}
      className={`kuiLink ${props.className || ''}`}
    />
  );
}

export function KibanaLinkComponent({
  location,
  pathname,
  hash,
  query,
  ...props
}) {
  const currentQuery = toQuery(location.search);
  const nextQuery = {
    _g: query._g ? rison.encode(query._g) : currentQuery._g,
    _a: query._a ? rison.encode(query._a) : ''
  };
  const search = stringifyWithoutEncoding(nextQuery);
  const href = url.format({
    pathname,
    hash: `${hash}?${search}`
  });

  return (
    <a {...props} href={href} className={`kuiLink ${props.className || ''}`} />
  );
}

const withLocation = connect(({ location }) => ({ location }), {});
export const RelativeLink = withLocation(RelativeLinkComponent);
export const KibanaLink = withLocation(KibanaLinkComponent);

// This is downright horrible 😭 💔
// Angular decodes encoded url tokens like "%2F" to "/" which causes the route to change.
// It was supposedly fixed in https://github.com/angular/angular.js/commit/1b779028fdd339febaa1fff5f3bd4cfcda46cc09 but still seeing the issue
export function legacyEncodeURIComponent(url) {
  return (
    url && encodeURIComponent(url.replace(/\//g, '~2F').replace(/ /g, '~20'))
  );
}

export function legacyDecodeURIComponent(url) {
  return (
    url && decodeURIComponent(url.replace(/~2F/g, '/').replace(/~20/g, ' '))
  );
}
