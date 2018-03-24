import moment from 'moment-timezone';
import { parseKibanaState } from '../../../../../../server/lib/parse_kibana_state';

export function getTimeFilterRange(browserTimezone, query = {}) {
  if (!query._g) {
    return;
  }

  const globalState = parseKibanaState(query, 'global');
  const time = globalState.get('time');
  if (!time) {
    return;
  }

  // Parse the time zone out so the timestamps stay in their original timezone rather than be converted to the
  // timezone on the server.  We want them to match what the user saw in their browser when generating the report,
  // based of their potentially custom timezone settings.
  const from = moment.tz(time.from, browserTimezone).format('llll');
  const to = moment.tz(time.to, browserTimezone).format('llll');

  return { from, to };
}
