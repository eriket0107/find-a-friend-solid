import { FastifyInstance } from "fastify";
import { organizationRoutes } from "./organization.route";
import { petsRoutes } from "./pet.route";
import { locationRoutes } from "./location.route";

export const routes = (app: FastifyInstance) => {
  app.register(organizationRoutes);
  app.register(petsRoutes);
  app.register(locationRoutes);
};
