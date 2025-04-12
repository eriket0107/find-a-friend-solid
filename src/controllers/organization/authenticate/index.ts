import { makeAuthenticateOrganizationUseCase } from "@/use-cases/organization/authenticate/authenticate.factory";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const authenticateRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const authenticateOrganizationUseCase = makeAuthenticateOrganizationUseCase();

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  console.log("authenticate");
  try {
    const { email, password } = authenticateRequestSchema.parse(request.body);

    const { organization } = await authenticateOrganizationUseCase.execute({
      email,
      password,
    });

    const accessToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: organization.id,
          expiresIn: "10m",
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: { expiresIn: "7d" },
      },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: true,
      })
      .status(200)
      .send({
        accessToken,
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
