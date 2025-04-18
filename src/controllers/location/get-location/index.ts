import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetLocationUseCase } from "@/use-cases/location/get-location/get-location.factory";
import { errorHandler } from "@/utils/error-handler";

const getLocationParamsSchema = z.object({
  latitude: z.string().transform(Number),
  longitude: z.string().transform(Number),
});

const getLocationUseCase = makeGetLocationUseCase();

export async function getLocationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { latitude, longitude } = getLocationParamsSchema.parse(request.query);

  try {
    const address = await getLocationUseCase.execute({
      latitude,
      longitude,
    });

    return reply.status(200).send(address);
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
