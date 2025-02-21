import { logger } from "@/utils/logger";
import { DeletePetByIdUseCase } from "./index";
import { PetTypeOrm } from "@/repositories/typerorm/pet.typeorm";

export const makeDeletePet = () => {
  return new DeletePetByIdUseCase(new PetTypeOrm(), logger);
};
