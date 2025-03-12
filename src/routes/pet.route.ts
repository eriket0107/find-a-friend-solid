import { create } from "@/controllers/pet/create";
import { deleteById } from "@/controllers/pet/delete-by-id";
import { getById } from "@/controllers/pet/get-by-id";
import { list } from "@/controllers/pet/list";
import { photoUpload } from "@/controllers/pet/photo-upload";
import { update } from "@/controllers/pet/update";
import { FastifyInstance } from "fastify";

export const petsRoutes = (app: FastifyInstance) => {
  app.post(
    "/pet",
    {
      schema: {
        description: "Creates a Pet",
        tags: ["Pet"],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "string" },
            gender: { type: "string", enum: ["M", "F"] },
            description: { type: "string" },
            organizationId: { type: "string" },
            breed: { type: "string" },
            traits: { type: "array", items: { type: "string" } },
          },
          required: [
            "name",
            "age",
            "gender",
            "description",
            "organizationId",
            "breed",
            "traits",
          ],
          additionalProperties: false,
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              gender: { type: "string", enum: ["M", "F"] },
              age: { type: "string" },
              breed: { type: "string" },
              traits: { type: "array", items: { type: "string" } },
            },
          },
          400: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    create,
  );

  app.patch(
    "/pet/:id",
    {
      schema: {
        tags: ["Pet"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        querystring: {
          type: "object",
          properties: {
            isProfilePhoto: { type: "boolean" },
          },
        },
      },
    },
    photoUpload,
  );

  app.put(
    "/pet/:id",
    {
      schema: {
        tags: ["Pet"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            name: { type: "string", nullable: true },
            age: { type: "string", nullable: true },
            gender: { type: "string", enum: ["M", "F"], nullable: true },
            breed: { type: "string", nullable: true },
            traits: {
              type: "array",
              items: { type: "string" },
              nullable: true,
            },
            description: { type: "string", nullable: true },
            organizationId: { type: "string", nullable: true },
            profilePhoto: { type: "string", nullable: true },
            photos: {
              type: "array",
              items: { type: "string" },
              nullable: true,
            },
          },
          additionalProperties: false,
        },
      },
    },
    update,
  );

  app.delete(
    "/pet/:id",
    {
      schema: {
        tags: ["Pet"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    },
    deleteById,
  );

  app.get(
    "/pet/:id",
    {
      schema: {
        tags: ["Pet"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              gender: { type: "string", enum: ["M", "F"] },
              age: { type: "string" },
              breed: { type: "string" },
              traits: { type: "array", items: { type: "string" } },
              profilePhoto: { type: "string" },
              photos: { type: "array", items: { type: "string" } },
            },
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    getById,
  );

  app.get(
    "/pet/list",
    {
      schema: {
        tags: ["Pet"],
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                description: { type: "string" },
                gender: { type: "string", enum: ["M", "F"] },
                age: { type: "string" },
                breed: { type: "string" },
                traits: { type: "array", items: { type: "string" } },
                profilePhoto: { type: "string" },
                photos: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
      },
    },
    list,
  );
};
