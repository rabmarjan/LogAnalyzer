export function singleLineScript(multiLineScript) {
  return multiLineScript.replace(/\s+/g, ' ').trim();
}
