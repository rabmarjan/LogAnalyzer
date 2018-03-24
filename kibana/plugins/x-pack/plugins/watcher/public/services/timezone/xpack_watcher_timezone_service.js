import { jstz as tzDetect } from 'jstimezonedetect';
import moment from 'moment';

export class XpackWatcherTimezoneService {
  constructor(config) {
    this.config = config;
  }

  getTimezone() {
    const DATE_FORMAT_CONFIG_KEY = 'dateFormat:tz';
    const isCustomTimezone = !this.config.isDefault(DATE_FORMAT_CONFIG_KEY);
    if (isCustomTimezone) {
      return this.config.get(DATE_FORMAT_CONFIG_KEY);
    }

    const detectedTimezone = tzDetect.determine().name();
    if (detectedTimezone) {
      return detectedTimezone;
    }

    const tzOffset = moment().format('Z');
    return tzOffset;
  }
}


