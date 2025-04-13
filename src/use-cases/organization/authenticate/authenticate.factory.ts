import { OrganizationTypeOrmRepository } from "@/repositories/typerorm/organization.typerorm";
import { AuthenticateOrganizationUseCase } from "./index";
import { logger } from "@/utils/logger";
import { PasswordHandler } from "@/utils/password-pandler";

export const makeAuthenticateOrganizationUseCase = () => {
  const repository = new OrganizationTypeOrmRepository();
  const passwordHandler = new PasswordHandler();
  return new AuthenticateOrganizationUseCase(
    repository,
    logger,
    passwordHandler,
  );
};
