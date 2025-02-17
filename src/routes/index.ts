import { FastifyInstance } from "fastify";
import { organizationRoutes } from "./organization.route";
import { petsRoutes } from "./pet.route";

export const routes = (app: FastifyInstance) => {
  app.register(organizationRoutes);
  app.register(petsRoutes);
};
