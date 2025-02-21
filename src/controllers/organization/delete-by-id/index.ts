import { makeDeleteOrganizationById } from "@/use-cases/organization/delete-by-id/delete.factory";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const deleteOrganizationRequestSchemaParams = z.object({
  id: z.string(),
});

const deleteOrganizationUseCase = makeDeleteOrganizationById();

export const deleteById = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = deleteOrganizationRequestSchemaParams.parse(request.params);

    await deleteOrganizationUseCase.execute({ id });

    return reply.status(204).send();
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
