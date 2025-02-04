import { Organization } from "database/entities/Organization";
import { IOrganizationRepository } from "../organization.repository";
import { randomUUID } from "node:crypto";

export class OrganizationInMemoryRepository implements IOrganizationRepository {
  private repository: Organization[] = [];

  async getByEmail(email: string): Promise<Organization | null> {
    const organization =
      this.repository.find((data) => data.email === email) || null;

    return organization;
  }

  async create(data: Organization): Promise<Organization> {
    const organization: Organization = {
      id: randomUUID(),
      ...data,
    };
    this.repository.push(organization);

    return organization;
  }

  async getByCnpj(cnpj: number): Promise<Organization | null> {
    const organization =
      this.repository.find((data) => data.cnpj === cnpj) || null;

    return organization;
  }

  delete(id: string) {
    this.repository = this.repository.filter((data) => data.id !== id);
  }

  async update({
    id,
    data,
  }: {
    id: string;
    data: Partial<Organization>;
  }): Promise<Organization> {
    const organizationToUpdate = this.repository.find((org) => org.id === id);

    if (!organizationToUpdate) throw new Error("Organization not found");

    Object.assign(organizationToUpdate, data);

    return organizationToUpdate;
  }

  async getById(id: string): Promise<Organization> {
    const organizationToGetById = this.repository.find(
      (data) => data.id === id
    );

    if (!organizationToGetById) throw new Error("Organization not found");

    return organizationToGetById;
  }
  async list(): Promise<Organization[]> {
    return this.repository;
  }
}
