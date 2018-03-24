const nonAlphaNumRE = /[^a-zA-Z0-9]/;
const allDoubleQuoteRE = /"/g;

export function createEscapeValue(quoteValues) {
  return function escapeValue(val) {
    if (quoteValues && nonAlphaNumRE.test(val)) {
      return `"${val.replace(allDoubleQuoteRE, '""')}"`;
    }
    return val;
  };
}
