import moment from 'moment-timezone';
import 'moment-duration-format';
import React from 'react';
import { KuiKeyboardAccessible } from 'ui_framework/components';
import { formatTimestampToDuration } from 'monitoring-common';
import { CALCULATE_DURATION_UNTIL } from 'monitoring-constants';

export function FormattedMessage({ prefix, suffix, message, metadata, changeUrl }) {
  const formattedMessage = (() => {
    if (metadata && metadata.link) {
      if (metadata.link.startsWith('https')) {
        return (
          <a
            className="kuiLink"
            href={metadata.link}
            target="_blank"
            rel="noopener noreferrer"
            data-test-subj="alertAction"
          >
            { message }
          </a>
        );
      }

      const goToLink = () => changeUrl(`/${metadata.link}`);

      return (
        <KuiKeyboardAccessible>
          <a className="kuiLink" onClick={goToLink} data-test-subj="alertAction">
            { message }
          </a>
        </KuiKeyboardAccessible>
      );
    }

    return message;
  })();

  if (metadata && metadata.time) {
    // scan message prefix and replace relative times
    // \w: Matches any alphanumeric character from the basic Latin alphabet, including the underscore. Equivalent to [A-Za-z0-9_].
    prefix = prefix.replace(/{{#relativeTime}}metadata\.([\w\.]+){{\/relativeTime}}/, (_match, field) => {
      return formatTimestampToDuration(metadata[field], CALCULATE_DURATION_UNTIL);
    });
    prefix = prefix.replace(/{{#absoluteTime}}metadata\.([\w\.]+){{\/absoluteTime}}/, (_match, field) => {
      return moment.tz(metadata[field], moment.tz.guess()).format('LLL z');
    });
  }

  // suffix and prefix don't contain spaces
  const formattedPrefix = prefix ? `${prefix} ` : null;
  const formattedSuffix = suffix ? ` ${suffix}` : null;
  return (
    <span data-test-subj="alertText">
      { formattedPrefix }
      { formattedMessage }
      { formattedSuffix }
    </span>
  );
}
