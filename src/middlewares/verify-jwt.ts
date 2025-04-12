import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";

export const verifyJwt = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    errorHandler({
      error,
      reply,
      code: 401,
      folder: "Middleware",
      entity: "JWT",
    });
  }
};
