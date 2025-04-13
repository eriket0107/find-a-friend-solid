import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";

export const refreshToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    await request.jwtVerify({
      onlyCookie: true,
    });

    const accessToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: request.user?.sub,
          expiresIn: "10m",
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          expiresIn: "7d",
          sub: request.user?.sub,
        },
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
      message: "Failed to refresh token",
      code: 401,
      folder: "Controller",
      entity: "Organization",
    });
  }
};
