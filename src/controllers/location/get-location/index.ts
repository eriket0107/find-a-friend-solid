import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetLocationUseCase } from "@/use-cases/location/get-location/get-location.factory";

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
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: "Invalid parameters" });
    }

    return reply.status(500).send({ message: "Internal server error" });
  }
}
