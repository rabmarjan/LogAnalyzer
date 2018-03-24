import { management } from 'ui/management';

export function updateHistorySection(display) {
  const statusSection = management.getSection('elasticsearch/watcher/watch/status');
  const editSection = management.getSection('elasticsearch/watcher/watch/edit');
  const newSection = management.getSection('elasticsearch/watcher/watch/new');
  const historySection = management.getSection('elasticsearch/watcher/watch/history-item');

  newSection.hide();
  statusSection.hide();
  editSection.hide();
  historySection.show();
  historySection.display = display;
}
