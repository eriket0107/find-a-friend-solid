import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    return reply.status(200).send();
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
