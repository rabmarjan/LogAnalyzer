import { registerRefreshRoute } from './register_refresh_route';

export function registerLicenseRoutes(server) {
  registerRefreshRoute(server);
}
