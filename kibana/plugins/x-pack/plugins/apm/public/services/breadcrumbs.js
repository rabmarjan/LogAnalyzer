import pathMatch from 'path-match';
import { get, isString } from 'lodash';
const routeMatcher = pathMatch();

export function setupRoutes(routes) {
  const matchers = Object.keys(routes).map(pattern => {
    return {
      match: routeMatcher(pattern),
      pattern
    };
  });

  return pathname => {
    const { match, pattern } =
      matchers.find(({ match }) => match(pathname)) || {};

    if (!match) {
      return [];
    }

    const params = match(pathname);
    return getBreadcrumbs({ pattern, pathname, params, routes });
  };
}

const getTokenized = pathname => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });

  return paths;
};

function getBreadcrumbs({ pattern, pathname, params, routes }) {
  const patterns = getTokenized(pattern);
  const urlTokens = getTokenized(pathname);

  return patterns
    .map((pattern, i) => ({
      pattern,
      urlToken: urlTokens[i]
    }))
    .filter(({ pattern }) => {
      return routes[pattern] && !routes[pattern].skip;
    })
    .map(({ pattern, urlToken }) => {
      const routePattern = routes[pattern];
      const labelOrHandler = get(routePattern, 'label') || routePattern;
      const label = isString(labelOrHandler)
        ? labelOrHandler
        : labelOrHandler(params);

      const urlOrHandler = get(routePattern, 'url') || urlToken;
      const url = isString(urlOrHandler) ? urlOrHandler : urlOrHandler(params);

      return { label, url };
    });
}
