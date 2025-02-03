import { Organization } from "database/entities/Organization";

export interface IOrganizationRepository {
  create(data: Organization): Promise<Organization>;
  findByEmail(email: string): Promise<Organization | null>;
  findByCnpj(cnpj: number): Promise<Organization | null>;
}