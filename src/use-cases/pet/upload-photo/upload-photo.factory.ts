import { PetTypeOrm } from "@/repositories/typerorm/pet.typeorm";
import { UploadPetPhotoUseCase } from ".";
import { PhotoStorage } from "@/utils/photo-storage";
import { logger } from "@/utils/logger";

export const makeUploadPetPhotoUseCase = () => {
  const petRepository = new PetTypeOrm();
  const photoStorage = new PhotoStorage(logger);

  return new UploadPetPhotoUseCase(logger, photoStorage, petRepository);
};
