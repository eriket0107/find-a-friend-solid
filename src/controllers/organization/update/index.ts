import { makeUpdateOrganization } from "@/use-cases/organization/update/update.factory";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const updateOrganizationRequestSchemaParams = z.object({
  id: z.string(),
});

const updateOrganizationRequestSchemaBody = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  cnpj: z
    .number()
    .min(14, { message: "must have cnpj correct length" })
    .optional(),
  whatsapp: z
    .number()
    .min(11, { message: "must have whatsapp correct length" })
    .optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  cep: z.number().optional(),
  country: z.string().optional(),
});

const updateOrganizationUseCase = makeUpdateOrganization();

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = updateOrganizationRequestSchemaParams.parse(request.params);
    const data = updateOrganizationRequestSchemaBody.parse(request.body);

    const { updatedOrganization } = await updateOrganizationUseCase.execute({
      id,
      data,
    });

    return reply.status(201).send(updatedOrganization);
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
