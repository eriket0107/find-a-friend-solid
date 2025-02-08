import { makeListOrganization } from "@/use-cases/organization/list/list.factory";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const listOrganizationRequestSchema = z.object({
  where: z
    .string()
    .optional()
    .transform((val) => (val ? JSON.parse(val) : undefined)),
  order: z
    .string()
    .optional()
    .transform((val) => (val ? JSON.parse(val) : undefined)),
  take: z.number().optional(),
  skip: z.number().optional(),
  filter: z
    .string()
    .optional()
    .transform((val) => (val ? JSON.parse(val) : undefined)),
});

const listOrganizationUseCase = makeListOrganization();

export const list = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { where, order, take, skip, filter } =
      listOrganizationRequestSchema.parse(request.query);
    const { organizations } = await listOrganizationUseCase.execute({
      where,
      order,
      take,
      skip,
      filter,
    });

    return reply.status(200).send(organizations);
  } catch (error) {
    errorHandler({
      error,
      reply,
      code: 400,
      folder: "Controller",
      entity: "Organization",
    });
  }
};
