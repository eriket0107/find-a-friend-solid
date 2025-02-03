import { Organization } from "database/entities/Organization";
import { IOrganizationRepository } from "../organization.repository";
import { randomUUID } from "node:crypto";

export class OrganizationInMemoryRepository implements IOrganizationRepository {
  private repository: Organization[] = [];

  async findByEmail(email: string): Promise<Organization | null> {
    const organization =
      this.repository.find((data) => data.email === email) || null;

    return organization;
  }


  async create(data: Organization): Promise<Organization> {
    const organization: Organization = {
      id: randomUUID(),
      ...data
    };
    this.repository.push(organization);

    return organization;
  }

  async findByCnpj(cnpj: number): Promise<Organization | null> {
    const organization = this.repository.find((data) => data.cnpj === cnpj) || null;

    return organization;
  }
}