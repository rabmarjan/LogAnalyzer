import { uiModules } from 'ui/modules';
import { breadcrumbsProvider } from './breadcrumbs_provider';
const uiModule = uiModules.get('monitoring/breadcrumbs', []);
uiModule.service('breadcrumbs', breadcrumbsProvider);

