import chrome from 'ui/chrome';
import { ROUTES } from '../../../common/constants';

export class FieldsService {
  constructor($http) {
    this.$http = $http;
    this.basePath = chrome.addBasePath(ROUTES.API_ROOT);
  }

  getFields(indexes = ['*']) {
    return this.$http.post(`${this.basePath}/fields`, { indexes })
      .then(response => {
        return response.data.fields;
      });
  }
}
