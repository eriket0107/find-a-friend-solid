import { makeCreateOrganization } from "@/use-cases/organization/create/create.factory";
import { errorHandler } from "@/utils/error-handler";
import { Organization } from "database/entities/Organization";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const createOrganizationRequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  cnpj: z.string().min(14, { message: "must have cnpj correct length" }),
  whatsapp: z
    .string()
    .min(11, { message: "must have whatsapp correct length" }),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  cep: z.string(),
  country: z.string(),
});

const createOrganizationUseCase = makeCreateOrganization();

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
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
      folder: "Controller",
      entity: "Organization",
    });
  }
};
