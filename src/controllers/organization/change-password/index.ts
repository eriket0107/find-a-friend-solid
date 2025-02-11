import { makeChangePasswordOrganization } from "@/use-cases/organization/change-password/change-password.factory";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const changePasswordOrganizationRequestSchemaParams = z.object({
  id: z.string(),
});

const changePasswordOrganizationRequestSchemaBody = z.object({
  password: z.string(),
  newPassword: z.string(),
});

const changePasswordOrganizationUseCase = makeChangePasswordOrganization();

export const changePassword = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = changePasswordOrganizationRequestSchemaParams.parse(
      request.params,
    );
    const { newPassword, password } =
      changePasswordOrganizationRequestSchemaBody.parse(request.body);

    const { updatedPassword } = await changePasswordOrganizationUseCase.execute(
      {
        id,
        newPassword,
        password,
      },
    );

    return reply.status(200).send(updatedPassword);
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
