import 'reflect-metadata'

import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'


export const app = fastify()

app.register(cors, {
  credentials: true,
  origin: true,
})

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Fastify API',
      description: 'API de vendas de produtos',
      version: '1.0.0',
    },
  },
})

app
  .register(fastifySwaggerUI, {
    routePrefix: '/docs',
  })
  .withTypeProvider()

// routes()

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})