import { LocationService } from "@/services/location";
import { GetCityByStateUseCase } from "@/use-cases/location/get-city-by-state";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const getCitiesByStateParamsSchema = z.object({
  state: z.string(),
});

export async function getCitiesByStateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { state } = getCitiesByStateParamsSchema.parse(request.params);
    const getCityByStateUseCase = new GetCityByStateUseCase(
      new LocationService(),
    );
    const cities = await getCityByStateUseCase.execute({ state });
    return reply.status(200).send(cities);
  } catch (error) {
    errorHandler({
      error,
      reply,
      code: 400,
      folder: "Controller",
      entity: "Location",
    });
  }
}
