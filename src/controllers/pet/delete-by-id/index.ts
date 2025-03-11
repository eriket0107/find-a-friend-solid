import { makeDeletePet } from "@/use-cases/pet/delete-by-id/delete.factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const deletePetUseCase = makeDeletePet();

const schema = z.object({
  id: z.string(),
});

export const deleteById = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = schema.parse(request.params);
  await deletePetUseCase.execute({ id });
  return reply.status(204).send();
};
