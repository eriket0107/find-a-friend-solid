import { Organization } from "database/entities/Organization";

export interface IOrganizationRepository {
  create(data: Organization): Promise<Organization>;
  findByEmail(email: string): Promise<Organization | null>;
  findByCnpj(cnpj: number): Promise<Organization | null>;
  update({ id, data }: { id: string, data: Organization }): Promise<Organization | null>
  delete(id: string): void
  get(id: string): Promise<Organization | null>
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
  }): Promise<Organization[]>
}