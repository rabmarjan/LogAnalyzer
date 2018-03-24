import { management } from 'ui/management';

export function updateWatchSections(watchId) {
  const statusSection = management.getSection('elasticsearch/watcher/watch/status');
  const editSection = management.getSection('elasticsearch/watcher/watch/edit');
  const newSection = management.getSection('elasticsearch/watcher/watch/new');
  const historySection = management.getSection('elasticsearch/watcher/watch/history-item');

  newSection.hide();
  statusSection.hide();
  editSection.hide();
  historySection.hide();

  if (watchId) {
    statusSection.url = `#/management/elasticsearch/watcher/watches/watch/${watchId}/status`;
    editSection.url = `#/management/elasticsearch/watcher/watches/watch/${watchId}/edit`;

    statusSection.show();
    editSection.show();
  } else {
    newSection.show();
  }
}
