import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { logger } from "@/utils/logger";
import { DeleteOrganizationeUseCase } from ".";

export const makeDeleteOrganization = () => {
  const organizationRepository = new OrganizationTypeOrmRepository();
  const deleteOrganizationUseCase = new DeleteOrganizationeUseCase(organizationRepository, logger);

  return deleteOrganizationUseCase;
};