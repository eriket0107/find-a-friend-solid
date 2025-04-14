import { FastifyInstance } from "fastify";
import { getLocationController } from "@/controllers/location/get-location";

export async function locationRoutes(app: FastifyInstance) {
  app.get("/location", getLocationController);
}
