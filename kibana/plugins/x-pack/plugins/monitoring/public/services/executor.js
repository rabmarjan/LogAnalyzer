import { uiModules } from 'ui/modules';
import { executorProvider } from './executor_provider';
const uiModule = uiModules.get('monitoring/executor', []);
uiModule.service('$executor', executorProvider);
