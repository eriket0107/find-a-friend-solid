import "reflect-metadata";

import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { logger } from "./utils/logger";
import { routes } from "./routes";


export const app = Fastify({
  logger: {
    level: 'info',
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          options: { colorize: true },
        },
        {
          target: 'pino/file',
          options: { destination: './logs/logs.txt', mkdir: true },
        },
      ],
    },
  },
});

app.register(cors, {
  credentials: true,
  origin: true,
});

app.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Find A Friend API",
      description: "Backend for Find a Pet",
      version: "1.0.0",
    },
  },
});

app
  .register(fastifySwaggerUI, {
    routePrefix: "/docs",
  })
  .withTypeProvider();

routes();

app.setErrorHandler((error, _, reply) => {
  logger("app").error({
    message: error.message,
    line: "54",
  });

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== "prod") {
    console.error(error);
  }

  logger("app").error({
    message: error.message,
    line: "71",
  });
  return reply.status(500).send({ message: "Internal server error" });
});
