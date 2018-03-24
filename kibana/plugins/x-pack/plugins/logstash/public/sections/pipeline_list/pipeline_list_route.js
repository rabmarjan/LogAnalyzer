import routes from 'ui/routes';
import { management } from 'ui/management';
import template from './pipeline_list_route.html';
import './components/pipeline_list';
import 'plugins/logstash/services/license';

routes
  .when('/management/logstash/pipelines/', {
    template
  });

routes.defaults(/\/management/, {
  resolve: {
    logstashManagementSection: ($injector) => {
      const licenseService = $injector.get('logstashLicenseService');
      const logstashSection = management.getSection('logstash/pipelines');

      if (licenseService.enableLinks) {
        logstashSection.show();
        logstashSection.enable();
      } else {
        logstashSection.hide();
      }
    }
  }
});
