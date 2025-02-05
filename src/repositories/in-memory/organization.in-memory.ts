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
  }): Promise<Organization | null> {
    const organizationToUpdate = this.repository.find((org) => org.id === id);

    if (!organizationToUpdate) return null;

    Object.assign(organizationToUpdate, data);

    return organizationToUpdate;
  }

  async getById(id: string): Promise<Organization | null> {
    const organizationToGetById = this.repository.find(
      (data) => data.id === id,
    );

    if (!organizationToGetById) return null;

    return organizationToGetById;
  }
  async list({
    where,
    order,
    take: limit = 10,
    skip = 0,
    filter = {},
  }: {
    where?: Partial<Organization>;
    order?: Record<string, "ASC" | "DESC">;
    take?: number;
    skip?: number;
    filter?: Partial<Record<keyof Organization, string>>;
  } = {}): Promise<Organization[]> {
    let results = this.repository;

    if (filter) {
      results = results.filter((org) => {
        return Object.entries(filter).every(([key, value]) => {
          const orgValue = org[key as keyof Organization];
          if (typeof orgValue === "string" && typeof value === "string") {
            return orgValue.toLowerCase().includes(value.toLowerCase());
          }
          return orgValue === value;
        });
      });
    }

    if (where) {
      results = results.filter((org) => {
        return Object.entries(where).every(([key, value]) => {
          return org[key as keyof Organization] === value;
        });
      });
    }

    if (order) {
      results = results.sort((a, b) => {
        for (const [key, direction] of Object.entries(order)) {
          const aValue = a[key as keyof Organization];
          const bValue = b[key as keyof Organization];

          if (aValue && bValue) {
            if (aValue < bValue) return direction === "ASC" ? -1 : 1;
            if (aValue > bValue) return direction === "ASC" ? 1 : -1;
          }
        }

        return 0;
      });
    }

    const start = skip;
    const end = skip + limit;
    return results.slice(start, end);
  }
}
