import chrome from 'ui/chrome';
import { ROUTES } from '../../../common/constants';

export class IndicesService {
  constructor($http) {
    this.$http = $http;
    this.basePath = chrome.addBasePath(ROUTES.API_ROOT);
  }

  getMatchingIndices(pattern) {
    return this.$http.post(`${this.basePath}/indices`, { pattern })
      .then(response => {
        return response.data.indices;
      });
  }
}
