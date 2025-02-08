import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { logger } from "@/utils/logger";
import { DeleteOrganizationByIdUseCase } from ".";

export const makeDeleteOrganizationById = () => {
  const organizationRepository = new OrganizationTypeOrmRepository();
  const deleteOrganizationUseCase = new DeleteOrganizationByIdUseCase(
    organizationRepository,
    logger,
  );

  return deleteOrganizationUseCase;
};
