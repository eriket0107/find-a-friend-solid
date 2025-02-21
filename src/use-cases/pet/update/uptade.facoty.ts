import { PetTypeOrm } from "@/repositories/typerorm/pet.typeorm";
import { UpdatePetUseCase } from ".";
import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { logger } from "@/utils/logger";

export const makeUpdatePet = () => {
  const petRepository = new PetTypeOrm();
  const organizationRepository = new OrganizationTypeOrmRepository();
  return new UpdatePetUseCase(petRepository, organizationRepository, logger);
};
