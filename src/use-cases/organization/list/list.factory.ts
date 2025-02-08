import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { ListOrganizationUseCase } from ".";
import { logger } from "@/utils/logger";

export const makeListOrganization = () => {
  const organizationRepository = new OrganizationTypeOrmRepository();
  const listOrganizationUseCase = new ListOrganizationUseCase(
    organizationRepository,
    logger,
  );

  return listOrganizationUseCase;
};
