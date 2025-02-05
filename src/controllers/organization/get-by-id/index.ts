import { makeGetByIdOrganization } from "@/use-cases/organization/get-by-id/get-by-id.factory";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const getByIdOrganizationRequestSchema = z.object({
  id: z.string(),
});

const getByIdOrganizationUseCase = makeGetByIdOrganization();

export const getById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = getByIdOrganizationRequestSchema.parse(request.params);

    const { organization } = await getByIdOrganizationUseCase.execute({ id });

    return reply.status(200).send(organization);
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
