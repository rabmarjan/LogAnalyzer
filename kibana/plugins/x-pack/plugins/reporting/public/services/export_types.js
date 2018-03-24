import { uiModules } from 'ui/modules';
import { ExportTypesRegistry } from '../../common/export_types_registry';

export const exportTypesRegistry = new ExportTypesRegistry();

const context = require.context('../../export_types', true, /public\/index.js/);
context.keys().forEach(key => context(key).register(exportTypesRegistry));

uiModules.get('xpack/reporting')
  .service('reportingExportTypes', function () {
    this.getById = (exportTypeId) => {
      return exportTypesRegistry.getById(exportTypeId);
    };
  });
