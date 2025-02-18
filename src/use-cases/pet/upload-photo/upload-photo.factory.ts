import { PetTypeOrm } from "@/repositories/typerorm/pet.typeorm";
import { UploadPetPhotoUseCase } from ".";
import { FileStorage } from "@/utils/filer-storage";
import { logger } from "@/utils/logger";

export const makeUploadPetPhotoUseCase = () => {
  const petRepository = new PetTypeOrm();
  const fileStorage = new FileStorage(logger);

  return new UploadPetPhotoUseCase(logger, fileStorage, petRepository);
};
