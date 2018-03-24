import { singleLineScript } from '../lib/single_line_script';

/*
watch.condition.script.inline
 */
function buildInline({ aggType, thresholdComparator, hasTermsAgg }) {
  let script = '';

  if (aggType === 'count' && !hasTermsAgg) {
    script = `
      if (ctx.payload.hits.total ${thresholdComparator} params.threshold) {
        return true;
      }

      return false;
    `;
  }

  if (aggType === 'count' && hasTermsAgg) {
    script = `
      ArrayList arr = ctx.payload.aggregations.bucketAgg.buckets;
      for (int i = 0; i < arr.length; i++) {
        if (arr[i].doc_count ${thresholdComparator} params.threshold) {
          return true;
        }
      }

      return false;
    `;
  }

  if (aggType !== 'count' && !hasTermsAgg) {
    script = `
      if (ctx.payload.aggregations.metricAgg.value ${thresholdComparator} params.threshold) {
        return true;
      }

      return false;
    `;
  }

  if (aggType !== 'count' && hasTermsAgg) {
    script = `
      ArrayList arr = ctx.payload.aggregations.bucketAgg.buckets;
      for (int i = 0; i < arr.length; i++) {
        if (arr[i]['metricAgg'].value ${thresholdComparator} params.threshold) {
          return true;
        }
      }

      return false;
    `;
  }

  return singleLineScript(script);
}

/*
watch.condition.script.params
 */
function buildParams({ threshold }) {
  return {
    threshold
  };
}

/*
watch.condition
 */
export function buildCondition(watch) {
  return {
    script: {
      source: buildInline(watch),
      params: buildParams(watch)
    }
  };
}
