import { makeUploadPetPhotoUseCase } from "@/use-cases/pet/upload-photo/upload-photo.factory";
import { SavedMultipartFile } from "@fastify/multipart";

export interface RabbitMQHandlers {
  queue: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (msg: any) => Promise<void>;
}

export const rabbitMQHandlers: RabbitMQHandlers[] = [
  {
    queue: "pet.created",
    handler: async (message: {
      petId: string;
      petPhoto: AsyncIterableIterator<SavedMultipartFile>;
    }) => {
      const uploadPetPhotoUseCase = makeUploadPetPhotoUseCase();

      if (message.petPhoto) {
        await uploadPetPhotoUseCase.execute({
          petId: message.petId,
          files: message.petPhoto,
          isProfilePhoto: true,
        });
      }

      console.log(`Received message from queue "pet.created":`, message);
    },
  },
];
