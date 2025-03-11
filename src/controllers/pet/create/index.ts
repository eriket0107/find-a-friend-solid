import { makeCreatePet } from "@/use-cases/pet/create/create.factory";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.string(),
  gender: z.enum(["M", "F"]),
  description: z.string(),
  organizationId: z.string(),
  breed: z.string(),
  traits: z.array(z.string()),
});

const createPetUseCase = makeCreatePet();

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { organizationId, ...pet } = schema.parse(request.body);

    const { petCreated } = await createPetUseCase.execute({
      pet: { ...pet, organizationId },
    });

    return reply.status(201).send(petCreated);
  } catch (error) {
    errorHandler({
      error,
      reply,
      code: 400,
      folder: "Controller",
      entity: "Pet",
    });
  }
};
