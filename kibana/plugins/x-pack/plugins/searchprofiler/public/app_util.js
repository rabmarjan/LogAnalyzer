import clarinet from 'clarinet';
import { Range } from './range';

export function checkForParseErrors(json, markers, ace) {
  for (const i in markers) {
    if (markers.hasOwnProperty(i)) {
      ace.session.removeMarker(markers[i]);
    }
  }
  try {
    json = JSON.parse(json);
  } catch (e) {
    // Notify with JSON.parse error, prettier

    const err = getJSONParseError(json);
    //notify.error(err.message + ' [' + e + ']');
    const lines = ace.session.getLength();

    // At the end, hard to see error, pad with some newlines
    if (lines === err.line) {
      ace.session.doc.insertNewLine({ row: lines, column: 0 });
      ace.session.doc.insertNewLine({ row: lines, column: 0 });
      ace.session.doc.insertNewLine({ row: lines, column: 0 });
    }
    ace.gotoLine(err.line);

    markers.push(ace.session.addMarker(new Range(err.line - 1, 0, err.line - 1, err.col), 'errorMarker', 'fullLine'));
    return { status: false, error: err.message + ' [' + e + ']' };
  }

  return { status: true, parsed: json };
}

/**
   * Extract a detailed JSON parse error
   * using https://github.com/dscape/clarinet
   *
   * Source: https://gist.github.com/davidrapin/93eec270153d90581097
   *
   * @param {string} json
   * @returns {{snippet:string, message:string, line:number, column:number, position:number}} or undefined if no error
   */
function getJSONParseError(json) {
  const parser = clarinet.parser();
  let firstError = undefined;

  // generate a detailed error using the parser's state
  function makeError(e) {
    let currentNL = 0;
    let nextNL = json.indexOf('\n');
    let line = 1;
    while (line < parser.line) {
      currentNL = nextNL;
      nextNL = json.indexOf('\n', currentNL + 1);
      ++line;
    }
    return {
      snippet: json.substr(currentNL + 1, nextNL - currentNL - 1),
      message: (e.message || '').split('\n', 1)[0],
      line: parser.line,
      column: parser.column
    };
  }

  // trigger the parse error
  parser.onerror = e => {
    firstError = makeError(e);
    parser.close();
  };
  try {
    parser.write(json).close();
  } catch (e) {
    if (firstError === undefined) {
      return makeError(e);
    } else {
      return firstError;
    }
  }

  return firstError;
}