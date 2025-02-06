import { FastifyInstance } from "fastify";
import { organizationRoutes } from "./organization.route";

export const routes = (app: FastifyInstance) => {
  app.register(organizationRoutes);
};
