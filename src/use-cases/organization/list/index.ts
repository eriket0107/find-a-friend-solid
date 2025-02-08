import { IOrganizationRepository } from "@/repositories/organization.repository";
import { LoggerType } from "@/utils/logger";
import { Organization } from "database/entities/Organization";

interface IListOrganizationsRequest {
  where?: Partial<Organization>;
  order?: Record<string, "ASC" | "DESC">;
  take?: number;
  skip?: number;
  filter?: Partial<Record<keyof Organization, string>>;
}

interface IListOrganizationsResponse {
  organizations: Organization[];
}

export class ListOrganizationUseCase {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly logger: LoggerType,
  ) {}

  async execute(
    params: IListOrganizationsRequest,
  ): Promise<IListOrganizationsResponse> {
    this.logger("Organization").info({
      message: `Start listing organizations`,
      folder: "List Organization UseCase",
    });

    const organizations = await this.repository.list(params);

    this.logger("Organization").info({
      message: `Finished listing organizations`,
      count: organizations.length,
    });

    return { organizations };
  }
}
