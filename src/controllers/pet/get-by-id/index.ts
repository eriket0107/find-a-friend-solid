import { formatPetResponse } from "@/helpers/format-pet-response";
import { makeGetPetById } from "@/use-cases/pet/get-by-id/get-by-id.factory";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const schemaParams = z.object({
  id: z.string(),
});

const getByIdUseCase = makeGetPetById();
export const getById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = schemaParams.parse(request.params);
    const { pet } = await getByIdUseCase.execute({ id });
    const body = formatPetResponse(pet);

    return reply.status(200).send(body);
  } catch (error) {
    errorHandler({
      error,
      entity: "Pet",
      folder: "Get By Id",
      reply,
    });
  }
};
