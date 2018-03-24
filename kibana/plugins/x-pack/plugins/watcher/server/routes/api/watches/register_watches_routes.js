import { registerListRoute } from './register_list_route';
import { registerDeleteRoute } from './register_delete_route';

export function registerWatchesRoutes(server) {
  registerListRoute(server);
  registerDeleteRoute(server);
}