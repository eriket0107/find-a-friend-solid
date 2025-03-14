import { Organization } from "database/entities/Organization";

export interface IOrganizationRepository {
  create(data: Organization): Promise<Organization>;
  getByEmail(email: string): Promise<Organization | null>;
  getByCnpj(cnpj: string): Promise<Organization | null>;
  update({
    id,
    data,
  }: {
    id: string;
    data: Partial<Organization>;
  }): Promise<Organization | null>;
  delete(id: string): void;
  getById(id: string): Promise<Organization | null>;
  list({
    where,
    order,
    take,
    skip,
  }: {
    where?: Partial<Organization>;
    order?: Record<string, "ASC" | "DESC">;
    take?: number;
    skip?: number;
  }): Promise<Organization[]>;
}
