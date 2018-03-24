import { registerLoadRoute } from './register_load_route';

export function registerHistoryRoutes(server) {
  registerLoadRoute(server);
}
