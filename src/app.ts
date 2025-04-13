import "reflect-metadata";

import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { logger } from "./utils/logger";
import { routes } from "./routes";
import { RabbitMQ } from "./services/rabbitmq";
import { rabbitMQHandlers } from "./config/rabbitmq.handlers";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";

const __dirname = path.resolve();
const rabbitMQ = new RabbitMQ();

export const app = Fastify({
  logger: {
    level: "info",
    transport: {
      targets: [
        {
          target: "pino-pretty",
          options: { colorize: true },
        },
        {
          target: "pino/file",
          options: { destination: "./logs/logs.txt", mkdir: true },
        },
      ],
    },
  },
});

app.register(cors, {
  credentials: true,
  origin: true,
});

app.register(fastifyCookie);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyMultipart, {
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB max file size
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
    uiConfig: {
      docExpansion: "none",
      deepLinking: false,
    },
    staticCSP: true,
  })
  .withTypeProvider();

rabbitMQ.startListening(rabbitMQHandlers);

app.register(fastifyStatic, {
  root: path.join(__dirname, "/uploads"),
  prefix: "/uploads",
});

routes(app);

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
    message: `Error message from APP: ${error.message}`,
    line: "71",
  });
  return reply.status(500).send({ message: "Internal server error" });
});
