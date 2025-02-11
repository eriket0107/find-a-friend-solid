import { changePassword } from "@/controllers/organization/change-password";
import { create } from "@/controllers/organization/create";
import { deleteById } from "@/controllers/organization/delete";
import { getById } from "@/controllers/organization/get-by-id";
import { list } from "@/controllers/organization/list";
import { update } from "@/controllers/organization/update";
import { FastifyInstance } from "fastify";

const organizationSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password_hash: { type: "string", nullable: true },
    name: { type: "string", maxLength: 255 },
    cnpj: { type: "string" },
    whatsapp: { type: "string" },
    cep: { type: "string" },
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
    "/organization",
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
              type: "string",
            },
            whatsapp: { type: "string" },
            cep: { type: "string" },
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

  app.delete(
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
              type: "string",
            },
            whatsapp: { type: "string" },
            cep: { type: "string" },
            city: { type: "string", maxLength: 255 },
            state: { type: "string", maxLength: 255 },
            street: { type: "string", maxLength: 255 },
            country: { type: "string", maxLength: 255 },
            password: { type: "string" },
            newPassword: { type: "string" },
          },
        },
        response: {
          204: {},
        },
      },
    },
    deleteById,
  );

  app.get(
    "/organization/list",
    {
      schema: {
        description:
          "Retrieve a list of organizations with optional filters, pagination, and sorting.",
        tags: ["Organization"],
        querystring: {
          type: "object",
          properties: {
            where: {
              type: "string",
              additionalProperties: { type: "string" },
            },
            order: {
              type: "string",
              additionalProperties: { type: "object", enum: ["ASC", "DESC"] },
            },
            take: {
              type: "integer",
              minimum: 1,
              description: "Number of records to return",
            },
            skip: {
              type: "integer",
              minimum: 0,
              description: "Number of records to skip for pagination",
            },
            filter: {
              type: "string",
              additionalProperties: { type: "string" },
            },
          },
          additionalProperties: false,
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                email: { type: "string", format: "email" },
                password_hash: { type: "string" },
                name: { type: "string" },
                cnpj: { type: "string" },
                whatsapp: { type: "string" },
                cep: { type: "string" },
                city: { type: "string" },
                state: { type: "string" },
                street: { type: "string" },
                country: { type: "string" },
                created_at: { type: "string", format: "date-time" },
                updated_at: { type: "string", format: "date-time" },
              },
            },
          },
          400: {
            description: "Invalid query parameters",
            type: "object",
            properties: {
              statusCode: { type: "integer", example: 400 },
              error: { type: "string", example: "Bad Request" },
              message: { type: "string" },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              statusCode: { type: "integer", example: 500 },
              error: { type: "string", example: "Internal Server Error" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    list,
  );

  app.patch(
    "/organization/change-password/:id",
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
    changePassword,
  );
};
