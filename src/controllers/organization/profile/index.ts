import { makeGetByIdOrganization } from "@/use-cases/organization/get-by-id/get-by-id.factory";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";

const getByIdOrganizationUseCase = makeGetByIdOrganization();

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { organization } = await getByIdOrganizationUseCase.execute({
      id: request.user?.sub,
    });

    return reply.status(200).send({
      ...organization,
      password_hash: undefined,
    });
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
