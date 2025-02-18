import { makeUploadPetPhotoUseCase } from "@/use-cases/pet/upload-photo/upload-photo.factory";
import { errorHandler } from "@/utils/error-handler";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const schemaParams = z.object({
  id: z.string(),
});

const schemaQuery = z.object({
  isProfilePhoto: z.coerce.boolean().default(false),
});

const updatePhotoUseCase = makeUploadPetPhotoUseCase();

export const photoUpload = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = schemaParams.parse(request.params);
    const { isProfilePhoto } = schemaQuery.parse(request.query);

    const files = request.files();

    const photos: string[] = [];

    await updatePhotoUseCase.execute({
      petId: id,
      files,
      isProfilePhoto,
    });

    return reply.status(200).send({ photos });
  } catch (error) {
    errorHandler({
      error,
      reply,
      code: 400,
      folder: "Controller",
      entity: "Pet",
    });
  }
};
