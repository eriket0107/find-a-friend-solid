import { PetTypeOrm } from "@/repositories/typerorm/pet.typeorm";
import { GetPetByIdUseCase } from ".";
import { logger } from "@/utils/logger";

export const makeGetPetById = () => {
  const petRepository = new PetTypeOrm();
  const getByIdUseCase = new GetPetByIdUseCase(petRepository, logger);
  return getByIdUseCase;
};
