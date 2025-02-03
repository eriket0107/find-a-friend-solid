import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { OrganizationCreateUseCase } from "@/use-cases/organization/create-use-case";
import { errorHandler } from "@/utils/errorHandler";
import { logger } from "@/utils/logger";
import { PasswordHandler } from "@/utils/passwordHandler";
import { Organization } from "database/entities/Organization";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const passwordHandler = new PasswordHandler();
const organizationRepository = new OrganizationTypeOrmRepository();
const createOrganizationUseCase = new OrganizationCreateUseCase(organizationRepository, logger, passwordHandler);


export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const createOrganizationRequestSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      cnpj: z.number().min(14, { message: "must have cnpj correct length" }),
      whatsapp: z
        .number()
        .min(11, { message: "must have whatsapp correct length" }),
      street: z.string(),
      city: z.string(),
      state: z.string(),
      cep: z.number(),
      country: z.string(),
    });

    const {
      name,
      email,
      password,
      cnpj,
      whatsapp,
      city,
      state,
      street,
      country,
      cep,
    } = createOrganizationRequestSchema.parse(request.body);

    const data: Organization = {
      name,
      email,
      cnpj,
      whatsapp,
      city,
      country,
      state,
      street,
      cep,
    };

    await createOrganizationUseCase.execute({
      data,
      password,
    });
    return reply.status(201).send({ message: "ok" });
  } catch (error) {
    errorHandler({
      error,
      reply,
      code: 400,
      file: 'Controller#Organization#Create',
    });
  }
};
