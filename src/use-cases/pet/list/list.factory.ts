import { logger } from "@/utils/logger";
import { ListPetUseCase } from "./index";
import { PetTypeOrm } from "@/repositories/typerorm/pet.typeorm";

export const makeListPetUseCase = () => {
  const repository = new PetTypeOrm();
  return new ListPetUseCase(repository, logger);
};
