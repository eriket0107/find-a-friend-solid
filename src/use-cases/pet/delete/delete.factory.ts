import { logger } from "@/utils/logger";
import { DeletePetUseCase } from "./index";
import { PetTypeOrm } from "@/repositories/typerorm/pet.typeorm";

export const makeDeletePet = () => {
  return new DeletePetUseCase(new PetTypeOrm(), logger);
};
