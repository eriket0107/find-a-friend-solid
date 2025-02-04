import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { logger } from "@/utils/logger";
import { GetByIdOrganizationUseCase } from ".";

export const makeDeleteOrganization = () => {
  const organizationRepository = new OrganizationTypeOrmRepository();
  const getByIdOrganizationUseCase = new GetByIdOrganizationUseCase(organizationRepository, logger);

  return getByIdOrganizationUseCase;
};