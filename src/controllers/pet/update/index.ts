import { makeUpdatePet } from "@/use-cases/pet/update/uptade.facoty";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const schemaParams = z.object({
  id: z.string(),
});

const schemaBody = z.object({
  name: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  breed: z.string().optional(),
  traits: z.array(z.string()).optional(),
  description: z.string().optional(),
  organizationId: z.string().optional(),
  profilePhoto: z.string().optional(),
  photos: z.array(z.string()).optional(),
  isAdopted: z.boolean().optional(),
});

const updatePetUseCase = makeUpdatePet();

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = schemaParams.parse(request.params);
    const data = schemaBody.parse(request.body);

    const pet = await updatePetUseCase.execute({
      id,
      data,
    });

    return reply.status(200).send(pet);
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
