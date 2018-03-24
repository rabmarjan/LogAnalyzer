import 'plugins/reporting/directives/export_config';
import { XPackInfoProvider } from 'plugins/xpack_main/services/xpack_info';
import { NavBarExtensionsRegistryProvider } from 'ui/registry/navbar_extensions';

function discoverReportProvider(Private) {
  const xpackInfo = Private(XPackInfoProvider);
  return {
    appName: 'discover',

    key: 'reporting-discover',
    label: 'Reporting',
    template: '<export-config object-type="Search" enabled-export-type="csv"></export-config>',
    description: 'Search Report',
    hideButton: () => !xpackInfo.get('features.reporting.csv.showLinks', false),
    disableButton: () => !xpackInfo.get('features.reporting.csv.enableLinks', false),
    tooltip: () => xpackInfo.get('features.reporting.csv.message'),
    testId: 'topNavReportingLink',
  };
}

NavBarExtensionsRegistryProvider.register(discoverReportProvider);
