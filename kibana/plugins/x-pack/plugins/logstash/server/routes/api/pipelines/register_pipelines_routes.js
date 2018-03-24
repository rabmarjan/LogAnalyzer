import { registerListRoute } from './register_list_route';
import { registerDeleteRoute } from './register_delete_route';

export function registerLogstashPipelinesRoutes(server) {
  registerListRoute(server);
  registerDeleteRoute(server);
}
