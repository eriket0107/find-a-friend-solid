import { FastifyInstance } from "fastify";
import { getLocationController } from "@/controllers/location/get-location";
import { getCitiesByStateController } from "@/controllers/location/get-city-by-state";

export async function locationRoutes(app: FastifyInstance) {
  app.get("/location", getLocationController);
  app.get("/location/cities/:state", getCitiesByStateController);
}
