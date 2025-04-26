import { errorHandler } from "@/utils/error-handler";
import { FastifyRequest, FastifyReply } from "fastify";

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    return reply
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: true,
      })
      .header("Clear-Access-Token", "true")
      .status(200)
      .send({
        message: "OK",
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
