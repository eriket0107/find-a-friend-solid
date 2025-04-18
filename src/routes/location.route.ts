import { FastifyInstance } from "fastify";
import { getLocationController } from "@/controllers/location/get-location";
import { getCitiesByStateController } from "@/controllers/location/get-city-by-state";

export async function locationRoutes(app: FastifyInstance) {
  app.get(
    "/location",
    {
      schema: {
        description: "Get location by coordinates",
        tags: ["Location"],
        type: "object",
      },
    },
    getLocationController,
  );
  app.get(
    "/location/cities/:state",
    {
      schema: {
        description: "Get cities by state",
        tags: ["Location"],
        params: {
          type: "object",
          properties: {
            state: { type: "string" },
          },
          required: ["state"],
        },
      },
    },
    getCitiesByStateController,
  );
}
