import { registerLoadRoute } from './register_load_route';
import { registerDeleteRoute } from './register_delete_route';
import { registerSaveRoute } from './register_save_route';

export function registerLogstashPipelineRoutes(server) {
  registerLoadRoute(server);
  registerDeleteRoute(server);
  registerSaveRoute(server);
}
