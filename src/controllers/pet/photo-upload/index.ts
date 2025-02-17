import { FileStorage } from "@/utils/filer-storage";
import { logger } from "@/utils/logger";
import { SavedMultipartFile } from "@fastify/multipart";
import { FastifyReply, FastifyRequest } from "fastify";

export const photoUpload = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const fileStorage = new FileStorage(logger);

    const file = await request.saveRequestFiles();

    const { photoPath } = await fileStorage.uploadFile({
      file: file[0] as unknown as SavedMultipartFile,
      id: "123",
      isProfilePhoto: false,
    });

    const updatedPhoto = await fileStorage.readFile(photoPath);

    return reply.status(200).type("image/png").send(updatedPhoto);
  } catch (error) {
    console.error("=======================================", error);
  }
};
