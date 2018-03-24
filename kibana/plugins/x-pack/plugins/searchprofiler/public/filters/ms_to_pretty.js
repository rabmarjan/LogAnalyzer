export function msToPretty(ms, precision) {
  if (!precision) {
    precision = 1;
  }
  ms = Number(ms);
  if (ms < 1000) {
    return ms.toFixed(precision) + 'ms';
  }

  ms /= 1000;
  if (ms < 60) {
    return ms.toFixed(precision) + 's';
  }

  ms /= 60;
  if (ms < 60) {
    return ms.toFixed(precision) + 'min';
  }

  ms /= 60;
  if (ms < 24) {
    return ms.toFixed(precision) + 'hr';
  }

  ms /= 24;
  return ms.toFixed(precision) + 'd';
}