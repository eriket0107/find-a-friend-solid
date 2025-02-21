import { create } from "@/controllers/pet/create";
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
        type: "object",
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
            profilePhoto: { type: "string" },
            photos: { type: "array", items: { type: "string" } },
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
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              gender: { type: "string", enum: ["M", "F"] },
              profilePhoto: { type: "string" },
              photos: { type: "array", items: { type: "string" } },
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
            name: { type: "string" },
            age: { type: "string" },
            gender: { type: "string", enum: ["M", "F"] },
            breed: { type: "string" },
            traits: { type: "array", items: { type: "string" } },
            description: { type: "string" },
            organization: { type: "string" },
          },
        },
      },
    },
    update,
  );
};
