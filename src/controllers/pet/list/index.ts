import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeListPetUseCase } from "@/use-cases/pet/list/list.factory";

const listOrganizationRequestSchema = z.object({
  where: z
    .string()
    .optional()
    .transform((val) => {
      try {
        return val ? JSON.parse(val) : undefined;
      } catch (e) {
        console.error("Invalid JSON for 'where':", { val, e });
        throw new Error("Invalid JSON format for 'where'");
      }
    }),
  order: z
    .string()
    .optional()
    .transform((val) => {
      try {
        return val ? JSON.parse(val) : undefined;
      } catch (e) {
        console.error("Invalid JSON for 'order':", { val, e });
        throw new Error("Invalid JSON format for 'order'");
      }
    }),
  take: z.number().optional(),
  skip: z.number().optional(),
  filter: z
    .string()
    .optional()
    .transform((val) => {
      try {
        return val ? JSON.parse(val) : undefined;
      } catch (e) {
        console.error("Invalid JSON for 'filter':", { val, e });
        throw new Error("Invalid JSON format for 'filter'");
      }
    }),
  organizationCity: z.string(),
});

const listPetUseCase = makeListPetUseCase();

export const list = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { where, order, take, skip, filter, organizationCity } =
      listOrganizationRequestSchema.parse(request.query);

    const { pets } = await listPetUseCase.execute({
      where,
      order,
      take,
      skip,
      filter,
      organizationCity,
    });

    return reply.status(200).send(pets);
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
