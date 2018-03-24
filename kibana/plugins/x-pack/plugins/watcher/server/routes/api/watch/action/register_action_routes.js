import { registerAcknowledgeRoute } from './register_acknowledge_route';

export function registerActionRoutes(server) {
  registerAcknowledgeRoute(server);
}