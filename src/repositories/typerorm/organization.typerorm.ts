import { Organization } from "database/entities/Organization";
import { IOrganizationRepository } from "../organization.repository";
import { dataSource } from "database/data-source";
import { Repository } from "typeorm";

export class OrganizationTypeOrmRepository implements IOrganizationRepository {
  private repository: Repository<Organization>;
  constructor() {
    this.repository = dataSource.getRepository(Organization);
  }

  async create(data: Organization): Promise<Organization> {
    return await this.repository.save(data);
  }
  async findByEmail(email: string): Promise<Organization | null> {
    return await this.repository.findOne({ where: { email } });
  }
  async findByCnpj(cnpj: number): Promise<Organization | null> {
    return await this.repository.findOne({ where: { cnpj } });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async update({
    id,
    data,
  }: {
    id: string;
    data: Organization;
  }): Promise<Organization | null> {
    const organizationToUpdate = await this.repository.findOne({
      where: { id },
    });

    if (!organizationToUpdate) {
      return null;
    }

    await this.repository.update(id, data);

    return await this.repository.findOne({ where: { id } });
  }
  async get(id: string): Promise<Organization | null> {

    const organizationToGetById = await this.repository.findOne({
      where: { id },
    });

    if (!organizationToGetById) {
      return null;
    }

    return organizationToGetById;
  }
  async list({
    where,
    order,
    take: limit = 10,
    skip = 0,
  }: {
    where?: Partial<Organization>;
    order?: Record<string, "ASC" | "DESC">;
    take?: number;
    skip?: number;
  }): Promise<Organization[]> {
    return await this.repository.find({
      where,
      order,
      take: limit,
      skip,

    });
  }
}
