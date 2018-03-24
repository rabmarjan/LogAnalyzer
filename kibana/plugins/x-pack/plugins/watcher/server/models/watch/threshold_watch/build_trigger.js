/*
watch.trigger.schedule
 */
function buildSchedule({ triggerIntervalSize, triggerIntervalUnit }) {
  return {
    interval: `${triggerIntervalSize}${triggerIntervalUnit}`
  };
}

export function buildTrigger(watch) {
  return {
    schedule: buildSchedule(watch)
  };
}
