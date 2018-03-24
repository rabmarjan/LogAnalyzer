import { createFlattenHit } from './flatten_hit';
import { createFormatCsvValues } from './format_csv_values';
import { createEscapeValue } from './escape_value';
import { createHitIterator } from './hit_iterator';
import { MaxSizeStringBuilder } from './max_size_string_builder';

export function createGenerateCsv(logger) {
  const hitIterator = createHitIterator(logger);

  return async function generateCsv({
    searchRequest,
    fields,
    formatsMap,
    metaFields,
    conflictedTypesFields,
    callEndpoint,
    cancellationToken,
    settings
  }) {
    const escapeValue = createEscapeValue(settings.quoteValues);
    const flattenHit = createFlattenHit(fields, metaFields, conflictedTypesFields);
    const formatCsvValues = createFormatCsvValues(escapeValue, settings.separator, fields, formatsMap);

    const builder = new MaxSizeStringBuilder(settings.maxSizeBytes);

    const header = `${fields.map(escapeValue).join(settings.separator)}\n`;
    if (!builder.tryAppend(header)) {
      return {
        content: '',
        maxSizeReached: true
      };
    }

    const iterator = hitIterator(settings.scroll, callEndpoint, searchRequest, cancellationToken);
    let maxSizeReached = false;

    // the following can be removed once the following is released in eslint-plugin-babel
    // https://github.com/babel/eslint-plugin-babel/commit/9468524ea342fa3ec3e2bff5d6e1180635726ab4
    // eslint-disable-next-line semi
    for await (const hit of iterator) {
      if (!builder.tryAppend(formatCsvValues(flattenHit(hit)) + '\n')) {
        logger('max Size Reached');
        maxSizeReached = true;
        cancellationToken.cancel();
        break;
      }
    }

    logger('finished generating');
    return {
      content: builder.getString(),
      maxSizeReached
    };
  };
}
