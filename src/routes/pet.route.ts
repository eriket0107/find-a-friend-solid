import { photoUpload } from "@/controllers/pet/photo-upload";
import { FastifyInstance } from "fastify";

export const petsRoutes = (app: FastifyInstance) => {
  app.patch("/pet", photoUpload);
};
