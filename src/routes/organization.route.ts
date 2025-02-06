import { create } from "@/controllers/organization/create";
import { getById } from "@/controllers/organization/get-by-id";
import { update } from "@/controllers/organization/update";
import { FastifyInstance } from "fastify";

const organizationSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password_hash: { type: "string", nullable: true },
    name: { type: "string", maxLength: 255 },
    cnpj: { type: "integer", minimum: 10000000000000, maximum: 99999999999999 },
    whatsapp: { type: "integer" },
    cep: { type: "integer" },
    city: { type: "string", maxLength: 255 },
    state: { type: "string", maxLength: 255 },
    street: { type: "string", maxLength: 255 },
    country: { type: "string", maxLength: 255 },
  },
  required: [
    "email",
    "name",
    "cnpj",
    "whatsapp",
    "cep",
    "city",
    "state",
    "street",
    "country",
  ],
};

export const organizationRoutes = async (app: FastifyInstance) => {
  app.post(
    "/organization-create",
    {
      schema: {
        description: "Creates an Organization",
        tags: ["Organization"],
        type: "object",
        body: organizationSchema,
      },
    },
    create,
  );

  app.get(
    "/organization/:id",
    {
      schema: {
        description: "Get an organization by ID",
        tags: ["Organization"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "Organization id" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: organizationSchema.properties,
          },
        },
      },
    },
    getById,
  );

  app.put(
    "/organization/:id",
    {
      schema: {
        description: "Update an organization by ID",
        tags: ["Organization"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "Organization id" },
          },
          required: ["id"],
        },
        body: {
          properties: {
            email: { type: "string", format: "email" },
            password_hash: { type: "string", nullable: true },
            name: { type: "string", maxLength: 255 },
            cnpj: {
              type: "integer",
              minimum: 10000000000000,
              maximum: 99999999999999,
            },
            whatsapp: { type: "integer" },
            cep: { type: "integer" },
            city: { type: "string", maxLength: 255 },
            state: { type: "string", maxLength: 255 },
            street: { type: "string", maxLength: 255 },
            country: { type: "string", maxLength: 255 },
            password: { type: "string" },
            newPassword: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: organizationSchema.properties,
          },
        },
      },
    },
    update,
  );
};
