import { FastifyReply, FastifyRequest } from "fastify";
import { GetLocationUseCase } from "@/use-cases/location/get-location";
import { getLocation } from "@/services/get-location";
import { z } from "zod";

const getLocationParamsSchema = z.object({
  latitude: z.string().transform(Number),
  longitude: z.string().transform(Number),
});

export async function getLocationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { latitude, longitude } = getLocationParamsSchema.parse(request.query);

  const getLocationUseCase = new GetLocationUseCase(getLocation);

  try {
    const location = await getLocationUseCase.execute({
      latitude,
      longitude,
    });

    return reply.status(200).send(location);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: "Invalid parameters" });
    }

    return reply.status(500).send({ message: "Internal server error" });
  }
}
