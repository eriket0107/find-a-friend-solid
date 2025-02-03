import { Organization } from "database/entities/Organization";
import { IOrganizationRepository } from "../organization.repository";
import { dataSource } from "database/data-source";
import { DataSource, Repository } from "typeorm";

export class OrganizationTypeOrmRepository implements IOrganizationRepository {

  constructor(private repository: Repository<Organization>) {
    this.repository = dataSource.getRepository(Organization);
  }
  async create(data: Organization): Promise<Organization> {
    return await this.repository.save(data);
  }
  async findByEmail(email: string): Promise<Organization | null> {
    return await this.repository.findOne({ where: { email } });
  }
}
